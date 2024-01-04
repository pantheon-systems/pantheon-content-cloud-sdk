import { validateComponentSchema } from "@pantheon-systems/pcc-sdk-core";
import axios from "axios";
import chalk from "chalk";
import dayjs from "dayjs";
import ora from "ora";
import AddOnApiHelper from "../../lib/addonApiHelper";
import { printTable } from "../../lib/cliDisplay";
import { errorHandler } from "../exceptions";

export const createSite = errorHandler<string>(async (url: string) => {
  const spinner = ora("Creating site...").start();
  try {
    const siteId = await AddOnApiHelper.createSite(url);
    spinner.succeed(
      `Successfully created the site with given details. Id: ${siteId}`,
    );
  } catch (e) {
    spinner.fail();
    throw e;
  }
});

type getComponentSchemaParams = { url: string; apiPath: string | null };
export const getComponentSchema = errorHandler<getComponentSchemaParams>(
  async ({ url, apiPath }: getComponentSchemaParams) => {
    const spinner = ora("Retrieving component schema...").start();
    const schemaEndpoint = `${url}${
      apiPath || "/api/pantheoncloud/component_schema"
    }`;
    const result = (await axios.get(schemaEndpoint)).data;

    spinner.succeed(
      `Retrieved component schema from ${schemaEndpoint}. Now checking its validity`,
    );

    try {
      validateComponentSchema(result);
    } catch (e) {
      spinner.fail(
        chalk.red(
          "Failed to validate this schema:",
          JSON.stringify(result, null, 4),
        ),
      );
      process.exit(1);
    }

    // Print out the component schema.
    console.log(JSON.stringify(result, null, 4));
  },
);

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
          Url: item.url || "",
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

export const SITE_EXAMPLES = [
  {
    description: "Create new site",
    command: "$0 site create --url test-site.com",
  },
  {
    description: "Get webhooks event delivery logs for a site",
    command: "$0 site webhooks history 8YUsfuf1EhjLGhswM49q",
  },
];
