#!/usr/bin/env node

import { exit } from 'process';
import { exec } from 'child_process';
import { Octokit } from 'octokit';
import { existsSync, rmSync, mkdirSync, writeFileSync } from 'fs';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import chalk from 'chalk';
import ora from 'ora';

const TEMP_DIR_NAME = '.tmp_react_sdk_90723';

const octokit = new Octokit();
async function sh(cmd) {
  return new Promise(function (resolve, reject) {
    exec(cmd, (err, stdout, stderr) => {
      if (err) {
        reject(err);
      } else {
        resolve({ stdout, stderr });
      }
    });
  });
}

const init = async (dirName) => {
  if (existsSync(TEMP_DIR_NAME)) rmSync(TEMP_DIR_NAME, { recursive: true });
  mkdirSync(TEMP_DIR_NAME);

  // Cloning starter kit locally
  const fetchStarter = ora('Fetching starter kit...').start();
  const { data } = await octokit.request('GET /repos/{owner}/{repo}/tarball', {
    owner: 'pantheon-systems',
    repo: 'pantheon-content-cloud-sdk',
  });
  process.chdir(TEMP_DIR_NAME);
  writeFileSync('./sdk-repo.tar', Buffer.from(data));
  await sh('tar xvpf sdk-repo.tar');
  await sh('mv pantheon-systems-pantheon-content-cloud-sdk* pantheon-sdk');
  process.chdir('../');
  fetchStarter.succeed('Fetched starter kit!');

  // Setting up new project
  const setupProj = ora('Setting up project...').start();
  if (!existsSync(dirName)) mkdirSync(dirName);
  process.chdir(dirName);
  await sh(`cp -r ../${TEMP_DIR_NAME}/pantheon-sdk/nextjs-starter/* .`);
  await sh(
    `sed -i.bak -e "s/@pantheon-systems\\/next-pcc-starter/${dirName}/g" package.json`,
  );
  setupProj.succeed('Completed setting up project!');

  // Installing dependencies
  // TODO: Enable after releasing changes from nextjs-starter
  // const installProj = ora('Installing dependencies...').start();
  // await sh('yarn install');
  // installProj.succeed('Installed project');

  process.chdir('../');

  // Cleaning up
  rmSync(TEMP_DIR_NAME, { recursive: true });

  // Messaging to get started
  console.log();
  console.log(chalk.green('To get started please run:'));
  console.log(chalk.green(`   cd ${dirName}`));
  console.log(chalk.green('   PCC_HOST=<host_name> yarn dev'));
};
yargs(hideBin(process.argv))
  .scriptName('react-sdk')
  .usage('$0 <cmd>')
  .command(
    'init',
    'Sets up project with required files. ',
    (yargs) => {
      yargs.positional('<project_dir_name>', {
        describe: 'The project directory to which setup should be done',
        demandOption: true,
      });
    },
    async (args) => {
      const projectDir = args._[1];
      if (!projectDir) {
        // Colorize in red
        console.error(
          'Please enter valid directory name. Check react-sdk init --help for details.',
        );
        exit(1);
      }
      await init(projectDir);
      console.log('Copied files to', args._[1]);
    },
  )
  .help(true).argv;
