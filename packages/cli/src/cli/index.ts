#!/usr/bin/env node
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import init from "./commands/init";
import login from "./commands/login";
import logout from "./commands/logout";
import { createSite, listSites, updateSite } from "./commands/sites";
import { createToken, listTokens, revokeToken } from "./commands/token";

yargs(hideBin(process.argv))
  .scriptName("pcc")
  .usage("$0 <cmd>")
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
          choices: ["nextjs", "gatsby"],
          demandOption: true,
        });
    },
    async (args) => {
      const dirName = args.project_directory as string;
      const template = args.template as CliTemplateOptions;

      await init({ dirName, template });
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
              describe: "ID of the token which you want to revoke",
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
          "list",
          "Lists existing sites.",
          () => {
            // noop
          },
          async () => await listSites(),
        )
        .command(
          "update <id> [options]",
          "Updates site for a given ID.",
          (yargs) => {
            yargs
              .positional("<id>", {
                describe: "ID of the site which you want to update",
                demandOption: true,
                type: "string",
              })
              .option("url", {
                describe: "Site url",
                type: "string",
              });
          },
          async (args) =>
            await updateSite({
              id: args.id as string,
              url: args.url as string,
            }),
        );
    },
    async () => {
      // noop
    },
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
  .help(true).argv;
