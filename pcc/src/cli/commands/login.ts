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

/**
 * Create a new OAuth2Client, and go through the OAuth2 content
 * workflow.  Return the full client to the callback.
 */
function main(): Promise<void> {
  return new Promise(async (resolve, reject) => {
    const fetchStarter = ora('Logging you in...').start();
    const authData = await getLocalAuthDetails();
    if (authData) {
      fetchStarter.succeed(`You are already logged in as ${authData.email}.`);
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
            await persistAuthDetails({
              accessToken: r.accessToken,
              refreshToken: r.refreshToken,
              idToken: r.idToken,
              email: r.email,
            });
            fetchStarter.succeed(
              `You are successfully logged in as ${r.email}`,
            );
            resolve();
          }
        } catch (e) {
          reject(e);
        }
      })
      .listen(3030, () => {
        // open the browser to the authorize url to start the workflow
        open(authorizeUrl, { wait: true }).then((cp) => cp.kill());
      });
    destroyer(server);
  });
}
const login = async () => {
  await main().catch(console.error);
};

export default login;
