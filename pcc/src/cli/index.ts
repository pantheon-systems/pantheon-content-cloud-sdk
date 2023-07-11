#!/usr/bin/env node
import { exit } from 'process';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import init from './commands/init';
import { createToken, listTokens, revokeToken } from './commands/token';
import login from './commands/login';
import logout from './commands/logout';
import { createSite, listSites } from './commands/sites';

yargs(hideBin(process.argv))
  .scriptName('pcc')
  .usage('$0 <cmd>')
  .strictCommands()
  .demandCommand()
  .command(
    'init <project_directory> [options]',
    'Sets up project with required files.',
    (yargs) => {
      yargs
        .positional('<project_directory>', {
          describe: 'The project directory in which setup should be done.',
          demandOption: true,
          type: 'string',
        })
        .option('template', {
          describe: 'Template from which files should be copied.',
          type: 'string',
          choices: ['nextjs', 'gatsby'],
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
    'token <cmd> [options]',
    'Enables you to manage tokens for a PCC project.',
    (yargs) => {
      yargs
        .strictCommands()
        .demandCommand()
        .command(
          'create',
          'Creates new token.',
          (yargs) => {},
          async (args) => await createToken(),
        )
        .command(
          'list',
          'Lists existing tokens.',
          (yargs) => {},
          async (args) => await listTokens(),
        )
        .command(
          'revoke [options]',
          'Revokes token for given id.',
          (yargs) => {
            yargs.option('id', {
              describe: 'Token ID',
              type: 'string',
              demandOption: true,
            });
          },
          async (args) => await revokeToken(args.id as string),
        );
    },
    async (args) => {},
  )
  .command(
    'site <cmd> [options]',
    'Enables you to manage sites for a PCC project.',
    (yargs) => {
      yargs
        .strictCommands()
        .demandCommand()
        .command(
          'create',
          'Creates new site.',
          (yargs) => {
            yargs
              .option('name', {
                describe: 'Site name',
                type: 'string',
                demandOption: true,
              })
              .option('url', {
                describe: 'Site url',
                type: 'string',
                demandOption: true,
              });
          },
          async (args) =>
            await createSite({
              name: args.name as string,
              url: args.url as string,
            }),
        )
        .command(
          'list',
          'Lists existing sites.',
          (yargs) => {},
          async (args) => await listSites(),
        );
    },
    async (args) => {},
  )
  .command(
    'login',
    'Logs you in you to PCC client.',
    (yargs) => {},
    async (args) => await login(),
  )
  .command(
    'logout',
    'Logs you out you from PCC client.',
    (yargs) => {},
    async (args) => await logout(),
  )
  .help(true).argv;
