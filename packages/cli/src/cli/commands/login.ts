import { readFileSync } from "fs";
import http from "http";
import { dirname, join } from "path";
import url, { fileURLToPath } from "url";
import { parseJwt } from "@pantheon-systems/pcc-sdk-core";
import nunjucks from "nunjucks";
import open from "open";
import ora from "ora";
import queryString from "query-string";
import destroyer from "server-destroy";
import AddOnApiHelper from "../../lib/addonApiHelper";
import { getApiConfig } from "../../lib/apiConfig";
import {
  getLocalAuthDetails,
  persistAuthDetails,
} from "../../lib/localStorage";
import { errorHandler } from "../exceptions";

nunjucks.configure({ autoescape: true });

const AUTH0_SCOPES = "openid profile article:read offline_access";

function login(extraScopes: string[]): Promise<void> {
  return new Promise(
    // eslint-disable-next-line no-async-promise-executor -- Handling promise rejection in the executor
    async (resolve, reject) => {
      const spinner = ora("Logging you in...").start();
      try {
        const authData = await getLocalAuthDetails(extraScopes);
        if (authData) {
          const scopes = authData.scope?.split(" ");

          if (
            !extraScopes?.length ||
            extraScopes.find((x) => scopes?.includes(x))
          ) {
            const tokenPayload = parseJwt(authData.access_token as string);
            spinner.succeed(
              `You are already logged in as ${tokenPayload["pcc/email"]}.`,
            );
            return resolve();
          }
        }

        const apiConfig = await getApiConfig();
        const authorizeUrl = `${apiConfig.auth0Issuer}/authorize?${queryString.stringify(
          {
            response_type: "code",
            client_id: apiConfig.auth0ClientId,
            redirect_uri: apiConfig.auth0RedirectUri,
            scope: AUTH0_SCOPES,
            audience: apiConfig.auth0Audience,
          },
        )}`;

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
              const tokenPayload = parseJwt(credentials.access_token as string);
              await persistAuthDetails(credentials);

              res.end(
                nunjucks.renderString(content.toString(), {
                  email: tokenPayload.email,
                }),
              );
              server.destroy();

              spinner.succeed(
                `You are successfully logged in as ${tokenPayload["pcc/email"]}`,
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
export const LOGIN_EXAMPLES = [
  { description: "Login the user", command: "$0 login" },
];
