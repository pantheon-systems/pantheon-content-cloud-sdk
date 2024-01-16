import { exit } from "process";
import chalk from "chalk";
import dayjs from "dayjs";
import ora from "ora";
import AddOnApiHelper from "../../lib/addonApiHelper";
import { printTable } from "../../lib/cliDisplay";
import { errorHandler, HTTPNotFound } from "../exceptions";

export const createToken = errorHandler<{
  siteId?: string;
}>(async (args) => {
  const spinner = ora("Creating token...").start();
  try {
    const apiKey = await AddOnApiHelper.createApiKey(args);
    spinner.succeed(`Successfully created token for your user. `);
    console.log("\nToken:", chalk.bold(chalk.green(apiKey)), "\n");
    console.log(
      chalk.bold(
        chalk.yellow("Please note it down. It wont be accessible hereafter."),
      ),
    );
  } catch (e) {
    spinner.fail();
    throw e;
  }
});

export const listTokens = errorHandler<void>(async () => {
  const spinner = ora("Fetching list of existing tokens...").start();
  try {
    const apiKeys = await AddOnApiHelper.listApiKeys();

    spinner.succeed("Successfully fetched list of tokens.");
    if (apiKeys.length === 0) {
      console.log(chalk.yellow("No tokens found."));
      return;
    }

    printTable(
      apiKeys.map((item) => {
        return {
          Id: item.id,
          Key: item.keyMasked,
          "Created At": dayjs(item.created).format("DD MMM YYYY, hh:mm A"),
        };
      }),
    );
  } catch (e) {
    spinner.fail();
    throw e;
  }
});

export const revokeToken = errorHandler<string>(async (id: string) => {
  const spinner = ora("Revoking token for given ID...").start();
  try {
    await AddOnApiHelper.revokeApiKey(id);
    spinner.succeed(
      `Successfully revoked token for ID "${chalk.bold(chalk.yellow(id))}"!`,
    );
  } catch (err) {
    spinner.fail();
    if (err instanceof HTTPNotFound) {
      console.log(chalk.red("Token for given ID not found."));
      exit(1);
    }
    throw err;
  }
});
