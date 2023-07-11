import ora from 'ora';
import AddOnApiHelper from '../../lib/addonApiHelper';
import chalk from 'chalk';
import { printTable } from '../../lib/cliDisplay';
import { errorHandler } from '../exceptions';

export const createSite = errorHandler<{ name: string; url: string }>(
  async ({ name, url }: { name: string; url: string }) => {
    const fetchStarter = ora('Creating site...').start();
    await AddOnApiHelper.createSite(name, url);
    fetchStarter.succeed(`Successfully created site with given details.`);
  },
);

export const listSites = errorHandler<void>(async () => {
  const fetchStarter = ora('Fetching list of existing sites...').start();
  const sites = await AddOnApiHelper.listSites();

  fetchStarter.succeed('Successfully fetched list of sites.');
  if (sites.length === 0) {
    console.log(chalk.yellow('No sites found.'));
    return;
  }

  printTable(
    sites.map((item) => {
      return {
        Id: item.id,
        Name: item.name,
        Url: item.url,
      };
    }),
  );
});
