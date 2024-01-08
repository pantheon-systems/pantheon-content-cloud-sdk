#!/usr/bin/env node
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import checkUpdate from "../lib/checkUpdate";
import { DOCUMENT_EXAMPLES, generatePreviewLink } from "./commands/documents";
import { importFromDrupal } from "./commands/import";
import init, { INIT_EXAMPLES } from "./commands/init";
import login, { LOGIN_EXAMPLES } from "./commands/login";
import logout, { LOGOUT_EXAMPLES } from "./commands/logout";
import showLogs from "./commands/logs";
import {
  configurableSiteProperties,
  createSite,
  getComponentSchema,
  listSites,
  SITE_EXAMPLES,
  updateSiteConfig,
} from "./commands/sites";
import {
  createToken,
  listTokens,
  revokeToken,
  TOKEN_EXAMPLES,
} from "./commands/token";
import printWhoAmI, { WHOAMI_EXAMPLES } from "./commands/whoAmI";
import { formatExamples } from "./examples";

const INSIDE_TEST = process.env.NODE_ENV === "test";

const configureMiddleware = (func: () => void) => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  if (INSIDE_TEST) return () => {};
  return func;
};

const LONG_LIVED_COMMANDS = ["site webhooks history"];

yargs(hideBin(process.argv))
  .scriptName("pcc")
  .usage("$0 <cmd>")
  .middleware(configureMiddleware(checkUpdate))
  .strictCommands()
  .demandCommand()
  .command(
    "init <project_directory> [options]",
    "Sets up project with required files.",
    (yargs) => {
      yargs
        .positional("<project_directory>", {
          describe: "The project directory in which setup should be done.",
          demandOption: true,
          type: "string",
        })
        .option("template", {
          describe: "Template from which files should be copied.",
          type: "string",
          choices: ["nextjs", "gatsby", "vue"],
          default: "nextjs",
          demandOption: true,
        })
        .option("appName", {
          describe: '"package.json" compatible name for the project.',
          type: "string",
          demandOption: false,
        })
        .option("noInstall", {
          describe: "Do not install any dependencies.",
          type: "boolean",
          default: false,
          demandOption: false,
        })
        .option("use-npm", {
          describe: "Use NPM package manager for installing dependencies.",
          type: "boolean",
          default: true,
          demandOption: false,
        })
        .option("use-pnpm", {
          describe: "Use PNPM package manager for installing dependencies.",
          type: "boolean",
          default: false,
          demandOption: false,
        })
        .option("use-yarn", {
          describe: "Use Yarn package manager for installing dependencies.",
          type: "boolean",
          default: false,
          demandOption: false,
        })
        .option("silent", {
          describe:
            "Skips all console output except for errors and return value from actions.",
          type: "boolean",
          default: false,
          demandOption: false,
        })
        .option("non-interactive", {
          describe: "Skips asking any questions to the user.",
          type: "boolean",
          default: false,
          demandOption: false,
        })
        .option("site-id", {
          describe: "Id of site to pre-populate .env file with.",
          type: "string",
          default: false,
          demandOption: false,
        })
        .option("eslint", {
          describe: "Initialize with eslint config.",
          type: "boolean",
          default: false,
          demandOption: false,
        })
        .option("ts", {
          describe: "Initialize as a Typescript project.",
          type: "boolean",
          default: false,
          demandOption: false,
        })
        .option("verbose", {
          describe: "Print verbose logs.",
          type: "boolean",
          default: true,
          demandOption: false,
        })
        .example(formatExamples(INIT_EXAMPLES));
    },
    async (args) => {
      const dirName = args.project_directory as string;
      const template = args.template as CliTemplateOptions;
      const noInstall = args.noInstall as boolean;
      const useYarn = args.useYarn as boolean;
      const usePnpm = args.usePnpm as boolean;
      const appName = args.appName as string | undefined;
      const silent = args.silent as boolean;
      const nonInteractive = args.nonInteractive as boolean;
      const siteId = args.siteId as string;
      const eslint = args.eslint as boolean;
      const useTypescript = args.ts as boolean;
      const printVerbose = args.verbose as boolean;

      // Deriving package manager from CLI flags in [NPM, PNPM, Yarn] order
      let packageManager: PackageManager;
      if (useYarn) packageManager = "yarn";
      else if (usePnpm) packageManager = "pnpm";
      else packageManager = "npm";
      await init({
        dirName,
        template,
        skipInstallation: noInstall,
        packageManager,
        appName,
        nonInteractive,
        siteId,
        silentLogs: silent,
        eslint,
        useTypescript,
        printVerbose,
      });
    },
  )
  .command(
    "token <cmd> [options]",
    "Manage tokens for a PCC project.",
    (yargs) => {
      yargs
        .strictCommands()
        .demandCommand()
        .command(
          "create",
          "Creates new token.",
          () => {
            // noop
          },
          async () => await createToken(),
        )
        .command(
          "list",
          "Lists existing tokens.",
          () => {
            // noop
          },
          async () => await listTokens(),
        )
        .command(
          "revoke <id>",
          "Revokes token for a given id.",
          (yargs) => {
            yargs.positional("<id>", {
              describe: "ID of the token which you want to revoke.",
              demandOption: true,
              type: "string",
            });
          },
          async (args) => await revokeToken(args.id as string),
        )
        .example(formatExamples(TOKEN_EXAMPLES));
    },
    async () => {
      // noop
    },
  )
  .command(
    "site <cmd> [options]",
    "Manage sites for a PCC project.",
    (yargs) => {
      yargs
        .strictCommands()
        .demandCommand()
        .command(
          "create [options]",
          "Creates new site.",
          (yargs) => {
            yargs.option("url", {
              describe: "Site url",
              type: "string",
              demandOption: true,
            });
          },
          async (args) => await createSite(args.url as string),
        )
        .command(
          "components [options]",
          "Shows component schema of the site.",
          (yargs) => {
            yargs.option("url", {
              describe: "Site url.",
              type: "string",
              demandOption: true,
            });

            yargs.option("apiPath", {
              describe: "API path such as /api/pantheoncloud/component_schema.",
              type: "string",
              demandOption: false,
            });
          },
          async (args) =>
            await getComponentSchema({
              url: args.url as string,
              apiPath: args.apiPath as string | null,
            }),
        )
        .command(
          "list",
          "Lists existing sites.",
          () => {
            // noop
          },
          async () => await listSites(),
        )
        .command(
          "configure <id> [options]",
          "Configure properties for a given site.",
          (yargs) => {
            yargs
              .strictCommands()
              .positional("<id>", {
                describe: "ID of the site which you want to configure.",
                demandOption: true,
                type: "string",
              })
              .check((args) => {
                const providedProperties = configurableSiteProperties.filter(
                  (property) => args[property.id],
                );

                if (providedProperties.length === 0) {
                  throw new Error(
                    "Please provide at least one property to configure.",
                  );
                }

                return true;
              });

            configurableSiteProperties.forEach((property) => {
              yargs.option(property.command.name, {
                describe: property.command.description,
                type: property.command.type,
              });
            });
          },
          async (args) =>
            await updateSiteConfig({
              id: args.id as string,
              ...(args as unknown as Record<
                (typeof configurableSiteProperties)[number]["id"],
                string
              >),
            }),
        )
        .command(
          "webhooks <cmd> [options]",
          "Manage webhooks for a given site.",
          (yargs) => {
            yargs
              .strictCommands()
              .demandCommand()
              .command(
                "history <id>",
                "View webhook event delivery logs for a given site.",
                (yargs) => {
                  yargs
                    .strictCommands()
                    .positional("<id>", {
                      describe:
                        "ID of the site for which you want to see logs.",
                      demandOption: true,
                      type: "string",
                    })
                    .option("limit", {
                      describe: "Number of logs to fetch at a time.",
                      type: "number",
                      default: 100,
                      demandOption: false,
                    });
                },
                async (args) =>
                  await showLogs({
                    id: args.id as string,
                    limit: args.limit as number,
                  }),
              );
          },
        )
        .example(formatExamples(SITE_EXAMPLES));
    },
    async () => {
      // noop
    },
  )
  .command(
    "document <cmd> [options]",
    "Manage documents for a PCC Project.",
    (yargs) => {
      yargs
        .strictCommands()
        .demandCommand()
        .command(
          "preview <id>",
          "Generates preview link for a given document ID.",
          (yargs) => {
            yargs
              .strictCommands()
              .positional("<id>", {
                describe: "ID of the document.",
                demandOption: true,
                type: "string",
              })
              .option("baseUrl", {
                describe: "Base URL for the generated preview link.",
                type: "string",
                demandOption: false,
              });
          },
          async (args) =>
            await generatePreviewLink({
              documentId: args.id as string,
              baseUrl: args.baseUrl as string,
            }),
        )
        .example(formatExamples(DOCUMENT_EXAMPLES));
    },
  )
  .command(
    "import",
    "Imports posts from a Drupal JSON API endpoint into PCC",
    (yargs) => {
      yargs
        .strictCommands()
        .demandCommand()
        .command(
          "drupal <baseUrl> <siteId>",
          "Imports all articles from a Drupal JSON API endpoint into a new Google Drive folder and connects them to a target PCC site",
          (yargs) => {
            yargs
              .strictCommands()
              .positional("baseUrl", {
                describe:
                  'URL of drupal json API endpoint such as "https://example.com/jsonapi/node/blog".',
                type: "string",
              })
              .positional("siteId", {
                describe: "Id of site to import articles into.",
                type: "string",
              })
              .demandOption(["baseUrl", "siteId"]);
          },
          async (args) =>
            await importFromDrupal({
              baseUrl: args.baseUrl as string,
              siteId: args.siteId as string,
            }),
        );
    },
    async () => {
      // noop
    },
  )
  .command(
    "whoami",
    "Print information about yourself.",
    () => {
      // noop
    },
    async () => await printWhoAmI(),
  )
  .command(
    "login",
    "Logs you in you to PCC client.",
    () => {
      // noop
    },
    async () => await login(),
  )
  .command(
    "logout",
    "Logs you out you from PCC client.",
    () => {
      // noop
    },
    async () => await logout(),
  )
  .example(
    formatExamples([
      ...LOGIN_EXAMPLES,
      ...INIT_EXAMPLES,
      ...TOKEN_EXAMPLES,
      ...SITE_EXAMPLES,
      ...DOCUMENT_EXAMPLES,
      ...WHOAMI_EXAMPLES,
      ...LOGOUT_EXAMPLES,
    ]),
  )
  .help(true)
  .wrap(null)
  .parseAsync()
  .then((res) => {
    const command = res._.join(" ");
    if (LONG_LIVED_COMMANDS.includes(command)) return;

    process.exit();
  });
