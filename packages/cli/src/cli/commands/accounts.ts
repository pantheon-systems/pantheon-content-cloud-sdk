import chalk from "chalk";
import dayjs from "dayjs";
import ora from "ora";
import AddOnApiHelper from "../../lib/addonApiHelper";
import { GoogleAuthProvider } from "../../lib/auth";
import { printTable } from "../../lib/cliDisplay";
import { errorHandler } from "../exceptions";

export const connectAccount = errorHandler<void>(async () => {
  const authProvider = new GoogleAuthProvider();
  await authProvider.login();
});

export const listAccounts = errorHandler<void>(async () => {
  const spinner = ora("Fetching list of connected accounts...").start();
  try {
    const apiKeys = await AddOnApiHelper.listAccounts();

    spinner.succeed("Successfully fetched list of accounts.");
    if (apiKeys.length === 0) {
      console.log(chalk.yellow("No accounts found."));
      return;
    }

    printTable(
      apiKeys.map((item) => {
        return {
          "Account Email": item.accountEmail,
          Name: item.name,
          "Connected At": dayjs(item.created).format("DD MMM YYYY, hh:mm A"),
        };
      }),
    );
  } catch (e) {
    spinner.fail();
    throw e;
  }
});

export const ACCOUNT_EXAMPLES = [
  { description: "Connect new account", command: "$0 token create" },
];
