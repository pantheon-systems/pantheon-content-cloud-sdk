#!/usr/bin/env node

import { chdir, exit } from 'process';
import { exec } from 'child_process';
import { Octokit } from 'octokit';
import {
  existsSync,
  rmSync,
  mkdirSync,
  writeFileSync,
  readFileSync,
  renameSync,
  readdirSync,
  cpSync,
} from 'fs';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import chalk from 'chalk';
import ora from 'ora';
import path from 'path';
import os from 'os';

const TEMP_DIR_NAME = path.join(os.tmpdir(), 'react_sdk_90723');
const TAR_FILE_NAME = 'sdk-repo.tar';
const TEMPLATE_FOLDER_MAP = {
  nextjs: 'nextjs-starter',
  gatsby: 'gatsby-starter',
};

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

const init = async (dirName, template) => {
  if (existsSync(TEMP_DIR_NAME)) rmSync(TEMP_DIR_NAME, { recursive: true });
  mkdirSync(TEMP_DIR_NAME);

  // Cloning starter kit locally
  const fetchStarter = ora('Fetching starter kit...').start();
  const { data } = await octokit.request('GET /repos/{owner}/{repo}/tarball', {
    owner: 'pantheon-systems',
    repo: 'pantheon-content-cloud-sdk',
  });
  writeFileSync(path.join(TEMP_DIR_NAME, TAR_FILE_NAME), Buffer.from(data));
  await sh(
    `tar xvpf ${path.join(TEMP_DIR_NAME, TAR_FILE_NAME)} -C ${TEMP_DIR_NAME}`,
  );
  let files = readdirSync(TEMP_DIR_NAME);
  files = files.filter((item) => item !== TAR_FILE_NAME);
  renameSync(
    path.join(TEMP_DIR_NAME, files[0]),
    path.join(TEMP_DIR_NAME, 'pantheon-sdk'),
  );
  fetchStarter.succeed('Fetched starter kit!');

  // Setting up new project
  const setupProj = ora('Setting up project...').start();
  if (existsSync(dirName)) {
    setupProj.stop();
    console.log(chalk.red('ERROR: Project directory already exists.'));
    exit(1);
  }

  cpSync(
    path.join(TEMP_DIR_NAME, 'pantheon-sdk', TEMPLATE_FOLDER_MAP[template]),
    dirName,
    { recursive: true },
  );
  chdir(dirName);
  const packageJson = JSON.parse(readFileSync('./package.json'));
  packageJson.name = dirName;
  writeFileSync('./package.json', JSON.stringify(packageJson, null, 2));

  // Commiting changes to Git
  await sh('git init');
  await sh('git add .');
  await sh(
    'git commit -m "Initial commit from Pantheon Content Cloud Toolkit."',
  );
  setupProj.succeed('Completed setting up project!');

  // Installing dependencies
  const installProj = ora('Installing dependencies...').start();
  await sh('yarn install');
  installProj.succeed('Installed dependencies!');
  process.chdir('../');

  // Cleaning up
  rmSync(TEMP_DIR_NAME, { recursive: true });

  // Messaging to get started
  console.log();
  console.log(
    chalk.green('To get started please replace the placeholders in .env.local'),
  );
  console.log(chalk.green(`   cd ${dirName}`));
  console.log(chalk.green(`   vim .env.local`));
  console.log(chalk.green('And then run the website'));
  if (template === 'nextjs') console.log(chalk.green('   yarn dev'));
  else console.log(chalk.green('   yarn start'));
};

yargs(hideBin(process.argv))
  .scriptName('pcc')
  .usage('$0 <cmd>')
  .command(
    'init <project_directory> [options]',
    'Sets up project with required files. ',
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
      const projectDir = args.project_directory;
      const template = args.template;

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
  .demandCommand()
  .help(true).argv;
