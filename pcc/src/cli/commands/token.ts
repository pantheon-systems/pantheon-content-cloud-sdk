import ora from 'ora';
import AddOnApiHelper from '../../lib/addonApiHelper';
import chalk from 'chalk';
import { printTable } from '../../lib/cliDisplay';
import dayjs from 'dayjs';
import { exit } from 'process';
import { HTTPNotFound, errorHandler } from '../exceptions';

export const createToken = errorHandler<void>(async () => {
  const fetchStarter = ora('Creating token...').start();
  const apiKey = await AddOnApiHelper.createApiKey();
  fetchStarter.succeed(`Successfully created token for your user. `);
  console.log('\nToken:', chalk.bold(chalk.green(apiKey)), '\n');
  console.log(
    chalk.bold(
      chalk.yellow('Please note it down. It wont be accessible hereafter.'),
    ),
  );
});
export const listTokens = errorHandler<void>(async () => {
  const fetchStarter = ora('Fetching list of existing tokens...').start();
  const apiKeys = await AddOnApiHelper.listApiKeys();

  fetchStarter.succeed('Successfully fetched list of tokens');
  if (apiKeys.length === 0) {
    console.log(chalk.yellow('No tokens found.'));
    return;
  }

  printTable(
    apiKeys.map((item) => {
      return {
        Id: item.id,
        Key: item.keyMasked,
        'Created At': dayjs(item.created).format('DD MMM YYYY, hh:mm A'),
      };
    }),
  );
});
export const revokeToken = errorHandler<string>(async (id: string) => {
  const fetchStarter = ora('Revoking token for given ID...').start();
  try {
    await AddOnApiHelper.revokeApiKey(id);
  } catch (err) {
    if (err instanceof HTTPNotFound) {
      fetchStarter.fail();
      console.log(chalk.red('Token for given ID not found.'));
      exit(1);
    }
  }
  fetchStarter.succeed(
    `Successfully revoked token for ID "${chalk.bold(chalk.yellow(id))}"!`,
  );
});
