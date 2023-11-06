#!/usr/bin/env node
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import checkUpdate from "../lib/checkUpdate";
import { generatePreviewLink } from "./commands/documents";
import init from "./commands/init";
import login from "./commands/login";
import logout from "./commands/logout";
import showLogs from "./commands/logs";
import {
  configurableSiteProperties,
  createSite,
  getComponentSchema,
  listSites,
  updateSiteConfig,
} from "./commands/sites";
import { createToken, listTokens, revokeToken } from "./commands/token";
import printWhoAmI from "./commands/whoAmI";

const INSIDE_TEST = process.env.NODE_ENV === "test";

const configureMiddleware = (func: () => void) => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  if (INSIDE_TEST) return () => {};
  return func;
};

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
          default: false,
          demandOption: false,
        });
    },
    async (args) => {
      const dirName = args.project_directory as string;
      const template = args.template as CliTemplateOptions;
      const noInstall = args.noInstall as boolean;
      const useYarn = args["use-yarn"] as boolean;
      const usePnpm = args["use-pnpm"] as boolean;
      const appName = args.appName as string | undefined;
      const silent = args.silent as boolean;
      const nonInteractive = args.nonInteractive as boolean;
      const siteId = args.site_id as string;
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
    "Enables you to manage tokens for a PCC project.",
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
        );
    },
    async () => {
      // noop
    },
  )
  .command(
    "site <cmd> [options]",
    "Enables you to manage sites for a PCC project.",
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
        );
    },
    async () => {
      // noop
    },
  )
  .command(
    "document <cmd> [options]",
    "Enables you to manage documents for a PCC Project.",
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
        );
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
  .help(true)
  .parseAsync()
  .then(() => process.exit());
