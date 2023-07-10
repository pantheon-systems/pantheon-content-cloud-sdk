import { OAuth2Client } from 'google-auth-library';
import http from 'http';
import url from 'url';
import open from 'open';
import destroyer from 'server-destroy';

const OAUTH_SCOPES = [
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/userinfo.email',
];

import AddOnApiHelper from '../../lib/addonApiHelper';
import ora from 'ora';
import {
  getLocalAuthDetails,
  persistAuthDetails,
} from '../../lib/localStorage';
import { GOOGLE_CLIENT_ID, GOOGLE_REDIRECT_URI } from '../../constants';
import { parseJwt } from '../../lib/jwt';

function login(): Promise<void> {
  return new Promise(async (resolve, reject) => {
    const fetchStarter = ora('Logging you in...').start();
    const authData = await getLocalAuthDetails();
    if (authData) {
      const jwtPayload = parseJwt(authData.idToken);
      fetchStarter.succeed(`You are already logged in as ${jwtPayload.email}.`);
      return;
    }

    const oAuth2Client = new OAuth2Client({
      clientId: GOOGLE_CLIENT_ID,
      redirectUri: GOOGLE_REDIRECT_URI,
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
            res.end('Success');
            server.destroy();

            const r = await AddOnApiHelper.getToken(code as string);
            const jwtPayload = parseJwt(r.idToken);
            await persistAuthDetails({
              accessToken: r.accessToken,
              refreshToken: r.refreshToken,
              idToken: r.idToken,
            });
            fetchStarter.succeed(
              `You are successfully logged in as ${jwtPayload.email}`,
            );
            resolve();
          }
        } catch (e) {
          reject(e);
        }
      })
      .listen(3030, () => {
        open(authorizeUrl, { wait: true }).then((cp) => cp.kill());
      });
    destroyer(server);
  });
}
export default login;
