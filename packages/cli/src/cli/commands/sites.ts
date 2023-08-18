import chalk from "chalk";
import dayjs from "dayjs";
import ora from "ora";
import AddOnApiHelper from "../../lib/addonApiHelper";
import { printTable } from "../../lib/cliDisplay";
import { errorHandler } from "../exceptions";

export const createSite = errorHandler<string>(async (url: string) => {
  const spinner = ora("Creating site...").start();
  try {
    await AddOnApiHelper.createSite(url);
    spinner.succeed(`Successfully created the site with given details.`);
  } catch (e) {
    spinner.fail();
    throw e;
  }
});

export const listSites = errorHandler<void>(async () => {
  const spinner = ora("Fetching list of existing sites...").start();
  try {
    const sites = await AddOnApiHelper.listSites();

    spinner.succeed("Successfully fetched list of sites.");
    if (sites.length === 0) {
      console.log(chalk.yellow("No sites found."));
      return;
    }

    printTable(
      sites.map((item) => {
        return {
          Id: item.id,
          Url: item.url,
          "Created At": item.created
            ? dayjs(item.created).format("DD MMM YYYY, hh:mm A")
            : "NA",
        };
      }),
    );
  } catch (e) {
    spinner.fail();
    throw e;
  }
});

export const updateSiteConfig = errorHandler(
  async ({
    id,
    ...configurableProperties
  }: {
    id: string;
  } & Partial<
    Record<(typeof configurableSiteProperties)[number]["id"], string>
  >) => {
    const spinner = ora("Updating site...").start();

    try {
      await AddOnApiHelper.updateSiteConfig(id, configurableProperties);
      spinner.succeed(`Successfully updated the site.`);
    } catch (e) {
      spinner.fail();
      throw e;
    }
  },
);

export const configurableSiteProperties = [
  {
    id: "url",
    command: {
      name: "url <url>",
      description: "Set url for a given site",
      type: "string",
    },
  },
  {
    id: "webhookUrl",
    command: {
      name: "webhook-url <webhookUrl>",
      description: "Set a webhook url for a given site",
      type: "string",
    },
  },
  {
    id: "webhookSecret",
    command: {
      name: "webhook-secret <webhookSecret>",
      description: "Set a webhook secret for a given site",
      type: "string",
    },
  },
] as const;
