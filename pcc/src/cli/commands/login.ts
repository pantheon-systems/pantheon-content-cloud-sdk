import { OAuth2Client } from 'google-auth-library';
import http from 'http';
import url from 'url';
import open from 'open';
import destroyer from 'server-destroy';

const OAUTH_SCOPES = [
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/userinfo.email',
];

import keys from './client_google.json';
import AddOnApiHelper from '../../lib/addonApiHelper';

const GOOGLE_CLIENT_ID =
  '142470191541-8o14j77pvagisc66s48kl4ub91f9c7b8.apps.googleusercontent.com';
const GOOGLE_REDIRECT_URI = 'http://localhost:3030/oauth-redirect';

const getOrPersistToken = (): string => {
  return '';
};

/**
 * Create a new OAuth2Client, and go through the OAuth2 content
 * workflow.  Return the full client to the callback.
 */
function main(): Promise<void> {
  return new Promise((resolve, reject) => {
    const oAuth2Client = new OAuth2Client({
      clientId: keys.web.client_id,
      redirectUri: keys.web.redirect_uris[0],
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
            res.end('<div>hello</div><script>window.close()</script>');
            server.destroy();

            const r = await AddOnApiHelper.getToken(code as string);
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
