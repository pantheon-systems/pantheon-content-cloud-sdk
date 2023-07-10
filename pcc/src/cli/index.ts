#!/usr/bin/env node
import { exit } from 'process';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import chalk from 'chalk';
import init from './commands/init';
import { createToken, listTokens, revokeToken } from './commands/token';
import login from './commands/login';
import logout from './commands/logout';

yargs(hideBin(process.argv))
  .scriptName('pcc')
  .usage('$0 <cmd>')
  .strictCommands()
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
      const projectDir = args.project_directory as string;
      const template = args.template as CliTemplateOptions;

      if (!projectDir) {
        console.error(
          chalk.red(
            'ERROR: Please enter valid directory name. Check pcc init --help for more details.',
          ),
        );
        exit(1);
      }
      await init(projectDir, template);
    },
  )
  .command(
    'token <cmd> [options]',
    'Enables you to manage tokens for a PCC project.',
    (yargs) => {
      yargs
        .command(
          'create',
          'Creates new token.',
          (yargs) => {},
          async (args) => {
            await createToken();
          },
        )
        .command(
          'list',
          'Lists existing tokens.',
          (yargs) => {},
          async (args) => {
            await listTokens();
          },
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
          async (args) => {
            const id = args.id as string;
            await revokeToken(id);
          },
        );
    },
    async (args) => {
      const projectDir = args.project_directory as string;
      const template = args.template as CliTemplateOptions;

      if (!projectDir) {
        console.error(
          chalk.red(
            'ERROR: Please enter valid directory name. Check pcc init --help for more details.',
          ),
        );
        exit(1);
      }
      await init(projectDir, template);
    },
  )
  .command(
    'login',
    'Logs you in you to PCC client.',
    (yargs) => {},
    async (args) => {
      await login();
    },
  )
  .command(
    'logout',
    'Logs you out you from PCC client.',
    (yargs) => {},
    async (args) => {
      await logout();
    },
  )
  .demandCommand()
  .help(true).argv;
