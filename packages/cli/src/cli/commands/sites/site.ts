import { readFileSync } from "fs";
import http from "http";
import { dirname, join } from "path";
import url, { fileURLToPath } from "url";
import { parseJwt } from "@pantheon-systems/pcc-sdk-core";
import chalk from "chalk";
import dayjs from "dayjs";
import { OAuth2Client } from "google-auth-library";
import nunjucks from "nunjucks";
import open from "open";
import ora from "ora";
import queryString from "query-string";
import destroyer from "server-destroy";
import AddOnApiHelper from "../../../lib/addonApiHelper";
import { getApiConfig } from "../../../lib/apiConfig";
import { printTable } from "../../../lib/cliDisplay";
import {
  getGoogleAuthDetails,
  persistGoogleAuthDetails,
} from "../../../lib/localStorage";
import { errorHandler } from "../../exceptions";

const OAUTH_SCOPES = ["https://www.googleapis.com/auth/userinfo.email"];

const connectGoogleAccount = async (googleAccount: string): Promise<void> => {
  return new Promise(
    // eslint-disable-next-line no-async-promise-executor -- Handling promise rejection in the executor
    async (resolve, reject) => {
      const spinner = ora("Connecting Google account...").start();
      try {
        const accounts = await getGoogleAuthDetails();
        const googleAuth = (accounts || []).find((acc) => {
          const payload = parseJwt(acc.id_token as string);
          return payload.email === googleAccount;
        });
        if (googleAuth) {
          const tokenPayload = parseJwt(googleAuth.id_token as string);
          spinner.succeed(
            `Google account(${tokenPayload.email}) is connected.`,
          );
          return resolve();
        }

        const apiConfig = await getApiConfig();
        const oAuth2Client = new OAuth2Client({
          clientId: apiConfig.googleClientId,
          redirectUri: apiConfig.googleRedirectUri,
        });

        // Generate the url that will be used for the consent dialog.
        const authorizeUrl = oAuth2Client.generateAuthUrl({
          access_type: "offline",
          scope: OAUTH_SCOPES,
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
              const credentials = await AddOnApiHelper.getGoogleToken(
                code as string,
              );
              const jwtPayload = parseJwt(credentials.id_token as string);

              res.end(
                nunjucks.renderString(content.toString(), {
                  email: jwtPayload.email,
                }),
              );
              server.destroy();

              if (jwtPayload.email !== googleAccount) {
                spinner.fail(
                  "Selected account doesn't match with provided email address.",
                );
                return reject();
              }

              await persistGoogleAuthDetails(credentials);
              spinner.succeed(
                `You have successfully connected the Google account: ${jwtPayload.email}`,
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
};

export const createSite = errorHandler<{ url: string; googleAccount: string }>(
  async ({ url, googleAccount }) => {
    const spinner = ora("Creating site...").start();
    if (!googleAccount) {
      spinner.fail("You must provide Google workspace account");
      return;
    }

    try {
      await connectGoogleAccount(googleAccount);
    } catch {
      return;
    }

    try {
      const siteId = await AddOnApiHelper.createSite(url);
      spinner.succeed(
        `Successfully created the site with given details. Id: ${siteId}`,
      );
    } catch (e) {
      spinner.fail();
      throw e;
    }
  },
);

export const deleteSite = errorHandler<{
  id: string;
  transferToSiteId: string | null | undefined;
  force: boolean;
}>(async ({ id, transferToSiteId, force }) => {
  const spinner = ora("Deleting site...").start();
  try {
    await AddOnApiHelper.deleteSite(id, transferToSiteId, force);
    spinner.succeed(`Successfully deleted the site with id "${id}"`);
  } catch (e) {
    spinner.fail();
    throw e;
  }
});

export const listSites = errorHandler<{
  withStatus?: boolean;
}>(async ({ withStatus }) => {
  const spinner = ora("Fetching list of existing sites...").start();
  try {
    const sites = await AddOnApiHelper.listSites({
      withConnectionStatus: withStatus,
    });

    spinner.succeed("Successfully fetched list of sites.");
    if (sites.length === 0) {
      console.log(chalk.yellow("No sites found."));
      return;
    }

    if (withStatus) {
      console.info(
        "\n",
        [
          chalk.underline("Legend"),
          '\n\u2022 "Frontend Connected" - Whether the site has been configured with a Pantheon SDK and can be reached at the given URL',
          '\u2022 "Smart Components" - Whether the site has been configured with Smart Component support',
          '\u2022 "Smart Component Preview" - Whether the site been configured with Smart Component preview support',
          "\n",
        ].join("\n"),
      );
    }

    printTable(
      sites.map((item) => {
        return {
          Id: item.id,
          Url: item.url || "",
          "Created At": item.created
            ? dayjs(item.created).format("DD MMM YYYY, hh:mm A")
            : "NA",
          ...(withStatus && {
            "Frontend Connected": Boolean(item?.connectionStatus?.connected),
            "Smart Components": Boolean(
              item?.connectionStatus?.capabilities?.smartComponents,
            ),
            "Smart Component Preview": Boolean(
              item?.connectionStatus?.capabilities?.smartComponentPreview,
            ),
          }),
        };
      }),
    );
  } catch (e) {
    spinner.fail();
    throw e;
  }
});

export const updateSiteConfig = errorHandler(
  async ({
    id,
    ...configurableProperties
  }: {
    id: string;
  } & Partial<
    Record<(typeof configurableSiteProperties)[number]["id"], string>
  >) => {
    const spinner = ora("Updating site...").start();

    try {
      await AddOnApiHelper.updateSiteConfig(id, configurableProperties);
      spinner.succeed(`Successfully updated the site.`);
    } catch (e) {
      spinner.fail();
      throw e;
    }
  },
);

export const configurableSiteProperties = [
  {
    id: "url",
    command: {
      name: "url <url>",
      description: "Set url for a given site",
      type: "string",
    },
  },
  {
    id: "webhookUrl",
    command: {
      name: "webhook-url <webhookUrl>",
      description: "Set a webhook url for a given site",
      type: "string",
    },
  },
  {
    id: "webhookSecret",
    command: {
      name: "webhook-secret <webhookSecret>",
      description: "Set a webhook secret for a given site",
      type: "string",
    },
  },
  {
    id: "visibility",
    command: {
      name: "visibility <visibility>",
      description:
        "Set the collection's visibility (either 'private' or 'workspace')",
      type: "string",
    },
  },
] as const;

export const SITE_EXAMPLES = [
  {
    description: "Create new site",
    command: "$0 site create --url test-site.com",
  },
  {
    description: "Get webhooks event delivery logs for a site",
    command: "$0 site webhooks history 123456789example1234",
  },
];
