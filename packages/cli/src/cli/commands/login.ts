import { readFileSync } from "fs";
import http from "http";
import { dirname, join } from "path";
import url, { fileURLToPath } from "url";
import { parseJwt } from "@pantheon-systems/pcc-sdk-core";
import { OAuth2Client } from "google-auth-library";
import nunjucks from "nunjucks";
import open from "open";
import ora from "ora";
import destroyer from "server-destroy";
import AddOnApiHelper from "../../lib/addonApiHelper";
import config from "../../lib/config";
import {
  getLocalAuthDetails,
  persistAuthDetails,
} from "../../lib/localStorage";
import { errorHandler } from "../exceptions";

nunjucks.configure({ autoescape: true });

const OAUTH_SCOPES = ["https://www.googleapis.com/auth/userinfo.email"];

function login(extraScopes: string[] = []): Promise<void> {
  return new Promise(
    // eslint-disable-next-line no-async-promise-executor -- Handling promise rejection in the executor
    async (resolve, reject) => {
      const spinner = ora("Logging you in...").start();
      try {
        const authData = await getLocalAuthDetails();
        if (authData) {
          let scopes = authData.scope?.split(" ");

          if (
            !extraScopes?.length ||
            extraScopes.find((x) => scopes?.includes(x))
          ) {
            const jwtPayload = parseJwt(authData.id_token as string);
            spinner.succeed(
              `You are already logged in as ${jwtPayload.email}.`,
            );
            return resolve();
          }
        }

        const oAuth2Client = new OAuth2Client({
          clientId: config.googleClientId,
          redirectUri: config.googleRedirectUri,
        });

        // Generate the url that will be used for the consent dialog.
        const authorizeUrl = oAuth2Client.generateAuthUrl({
          access_type: "offline",
          scope: [...OAUTH_SCOPES, ...extraScopes],
        });

        const server = http.createServer(async (req, res) => {
          try {
            if (!req.url) {
              throw new Error("No URL path provided");
            }

            if (req.url.indexOf("/oauth-redirect") > -1) {
              const qs = new url.URL(req.url, "http://localhost:3030")
                .searchParams;
              const code = qs.get("code");
              const currDir = dirname(fileURLToPath(import.meta.url));
              const content = readFileSync(
                join(currDir, "../templates/loginSuccess.html"),
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
        });

        destroyer(server);

        server.listen(3030, () => {
          open(authorizeUrl, { wait: true }).then((cp) => cp.kill());
        });
      } catch (e) {
        spinner.fail();
        reject(e);
      }
    },
  );
}
export default errorHandler<string[]>(login);
