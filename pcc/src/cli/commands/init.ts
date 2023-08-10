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
import ora from 'ora';
import path from 'path';
import os from 'os';
import chalk from 'chalk';
import { errorHandler } from '../exceptions';
import { Logger, SpinnerLogger } from '../../lib/logger';
const TEMP_DIR_NAME = path.join(os.tmpdir(), 'react_sdk_90723');
const TAR_FILE_NAME = 'sdk-repo.tar';
const TEMPLATE_FOLDER_MAP = {
  nextjs: 'nextjs-starter',
  gatsby: 'gatsby-starter',
};

// TODO: Make sure below ESLINT versions are not stale.
const ESLINT_DEPENDENCIES = {
  eslint: '^8.24.0',
  'eslint-config-next': '^13.1.1',
};

const ESLINT_CONFIG = {
  extends: 'next/core-web-vitals',
};

const octokit = new Octokit();
async function sh(cmd: string) {
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
/**
 * Handles initializing projects for PCC
 */
const init = async ({
  dirName,
  template,
  skipInstallation,
  packageManager,
  silentLogs,
  eslint,
  appName,
}: {
  dirName: string;
  template: CliTemplateOptions;
  skipInstallation: boolean;
  packageManager: PackageManager;
  silentLogs: boolean;
  eslint: boolean;
  appName?: string;
}) => {
  const logger = new Logger(silentLogs);
  if (!dirName) {
    logger.error(
      chalk.red(
        'ERROR: Please enter valid directory name. Check pcc init --help for more details.',
      ),
    );
    exit(1);
  }

  if (existsSync(TEMP_DIR_NAME)) rmSync(TEMP_DIR_NAME, { recursive: true });
  mkdirSync(TEMP_DIR_NAME);

  // Cloning starter kit locally
  const fetchStarter = new SpinnerLogger('Fetching starter kit...', silentLogs);
  fetchStarter.start();
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
  const setupProj = new SpinnerLogger('Setting up project...', silentLogs);
  setupProj.start();
  if (existsSync(dirName)) {
    setupProj.stop();
    logger.error(chalk.red('ERROR: Project directory already exists.'));
    exit(1);
  }

  cpSync(
    path.join(TEMP_DIR_NAME, 'pantheon-sdk', TEMPLATE_FOLDER_MAP[template]),
    dirName,
    { recursive: true },
  );
  chdir(dirName);
  const packageJson = JSON.parse(readFileSync('./package.json').toString());
  if (appName) packageJson.name = appName;
  else packageJson.name = path.parse(dirName).base;

  if (eslint) {
    packageJson.devDependencies = {
      ...packageJson.devDependencies,
      ...ESLINT_DEPENDENCIES,
    };

    writeFileSync('./.eslintrc.json', JSON.stringify(ESLINT_CONFIG, null, 2));
  }

  writeFileSync('./package.json', JSON.stringify(packageJson, null, 2) + '\n');

  // Committing changes to Git
  await sh('git init');
  await sh('git add .');
  await sh(
    'git commit -m "Initial commit from Pantheon Content Cloud Toolkit."',
  );
  setupProj.succeed('Completed setting up project!');

  const localEnvFileName =
    template === 'gatsby' ? '.env.development' : '.env.local';

  // Create .env.local/.env.development
  await sh(`cp .env.example ${localEnvFileName}`);

  if (!skipInstallation) {
    // Installing dependencies
    const installProj = new SpinnerLogger(
      'Installing dependencies...',
      silentLogs,
    );
    installProj.start();
    await sh(`${packageManager} install`);
    installProj.succeed('Installed dependencies!');
  }

  // Cleaning up
  process.chdir('../');
  rmSync(TEMP_DIR_NAME, { recursive: true });

  // Messaging to get started
  logger.log();
  logger.log(
    chalk.green(
      `To get started please replace the placeholders in ${localEnvFileName}`,
    ),
  );
  logger.log(chalk.green(`   cd ${dirName}`));
  logger.log(chalk.green(`   vim .env.local`));
  logger.log(chalk.green('And then run the website'));
  if (template === 'nextjs') logger.log(chalk.green('   yarn dev'));
  else logger.log(chalk.green('   yarn start'));
};

export default errorHandler<{
  dirName: string;
  template: CliTemplateOptions;
  packageManager: PackageManager;
  skipInstallation: boolean;
  silentLogs: boolean;
  eslint: boolean;
  appName?: string;
}>(init);
