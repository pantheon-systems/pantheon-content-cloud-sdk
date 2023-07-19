import { OAuth2Client } from 'google-auth-library';
import http from 'http';
import url from 'url';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import open from 'open';
import destroyer from 'server-destroy';
import { readFileSync } from 'fs';
import nunjucks from 'nunjucks';
nunjucks.configure({ autoescape: true });

const OAUTH_SCOPES = ['https://www.googleapis.com/auth/userinfo.email'];

import AddOnApiHelper from '../../lib/addonApiHelper';
import ora from 'ora';
import {
  getLocalAuthDetails,
  persistAuthDetails,
} from '../../lib/localStorage';
import { parseJwt } from '../../lib/jwt';
import { errorHandler } from '../exceptions';
import config from '../../lib/config';

function login(): Promise<void> {
  return new Promise(async (resolve, reject) => {
    const spinner = ora('Logging you in...').start();
    try {
      const authData = await getLocalAuthDetails();
      if (authData) {
        const jwtPayload = parseJwt(authData.id_token as string);
        spinner.succeed(`You are already logged in as ${jwtPayload.email}.`);
        return;
      }

      const oAuth2Client = new OAuth2Client({
        clientId: config.googleClientId,
        redirectUri: config.googleRedirectUri,
      });

      // Generate the url that will be used for the consent dialog.
      const authorizeUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: OAUTH_SCOPES,
      });

      const server = http
        .createServer(async (req: any, res) => {
          try {
            if (req.url.indexOf('/oauth-redirect') > -1) {
              const qs = new url.URL(req.url, 'http://localhost:3030')
                .searchParams;
              const code = qs.get('code');
              const currDir = dirname(fileURLToPath(import.meta.url));
              const content = readFileSync(
                join(currDir, '../templates/loginSuccess.html'),
              );
              const credentials = await AddOnApiHelper.getToken(code as string);
              const jwtPayload = parseJwt(credentials.id_token as string);
              await persistAuthDetails(credentials);

              res.end(
                nunjucks.renderString(content.toString(), {
                  email: jwtPayload.email,
                }),
              );
              server.destroy();

              spinner.succeed(
                `You are successfully logged in as ${jwtPayload.email}`,
              );
              resolve();
            }
          } catch (e) {
            spinner.fail();
            reject(e);
          }
        })
        .listen(3030, () => {
          open(authorizeUrl, { wait: true }).then((cp) => cp.kill());
        });
      destroyer(server);
    } catch (e) {
      spinner.fail();
      throw e;
    }
  });
}
export default errorHandler<void>(login);
