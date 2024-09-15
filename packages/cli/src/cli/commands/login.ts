import { readFileSync } from "fs";
import http from "http";
import { dirname, join } from "path";
import url, { fileURLToPath } from "url";
import nunjucks from "nunjucks";
import open from "open";
import ora from "ora";
import destroyer from "server-destroy";
import {
  getLocalAuthDetails,
  JwtCredentials,
  persistAuthDetails,
} from "../../lib/localStorage";
import { errorHandler } from "../exceptions";

nunjucks.configure({ autoescape: true });

const OAUTH_SCOPES = ["https://www.googleapis.com/auth/userinfo.email"];

function login(): Promise<void> {
  return new Promise(
    // eslint-disable-next-line no-async-promise-executor -- Handling promise rejection in the executor
    async (resolve, reject) => {
      const spinner = ora("Logging you in...").start();
      try {
        const authData = (await getLocalAuthDetails()) as JwtCredentials | null;
        if (authData) {
          console.log("already exists", JSON.stringify({ authData }, null, 4));
          //   spinner.succeed(
          //     `You are already logged in as ${authData.email}.`,
          //   );
          //   return resolve();
        }

        const server = http.createServer(async (req, res) => {
          try {
            if (!req.url) {
              throw new Error("No URL path provided");
            }

            if (req.url.indexOf("/auth-success") !== -1) {
              const qs = new url.URL(req.url, "http://localhost:3030")
                .searchParams;
              const idToken = qs.get("idToken") as string;
              const oauthToken = qs.get("oauthToken") as string;
              const email = qs.get("email") as string;
              const expiration = qs.get("expiration") as string;
              const currDir = dirname(fileURLToPath(import.meta.url));
              const content = readFileSync(
                join(currDir, "../templates/loginSuccess.html"),
              );

              await persistAuthDetails(
                {
                  idToken,
                  oauthToken,
                  email,
                  expiration,
                }
              );

              res.end(
                nunjucks.renderString(content.toString(), {
                  email: email,
                }),
              );
              server.destroy();

              spinner.succeed(`You are successfully logged in as ${email}`);
              resolve();
            } else {
              res.writeHead(200, { "Content-Type": "text/plain" });
              res.end("Hello World\n");
              return;
            }
          } catch (e) {
            spinner.fail();
            reject(e);
          }
        });

        destroyer(server);

        server.listen(3030, () => {
          // const apiConfig = await getApiConfig();
          open("http://localhost:3000/auth/cli", { wait: true }).then((cp) =>
            cp.kill(),
          );
        });
      } catch (e) {
        spinner.fail();
        reject(e);
      }
    },
  );
}
export default errorHandler<void>(login);
export const LOGIN_EXAMPLES = [
  { description: "Login the user", command: "$0 login" },
];
