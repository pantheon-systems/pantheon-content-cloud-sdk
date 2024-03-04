import {
  SmartComponentMapZod,
  validateComponentSchema,
} from "@pantheon-systems/pcc-sdk-core/*";
import axios from "axios";
import chalk from "chalk";
import ora from "ora";
import AddOnApiHelper from "../../../lib/addonApiHelper";
import { errorHandler } from "../../exceptions";

type pushComponentSchemaParams = {
  siteId: string;
  componentSchema: typeof SmartComponentMapZod;
};
export const pushComponentSchema = errorHandler<pushComponentSchemaParams>(
  async ({ siteId, componentSchema }: pushComponentSchemaParams) => {
    const spinner = ora("Retrieving component schema...").start();
    const result = await AddOnApiHelper.pushComponentSchema(
      siteId,
      componentSchema,
    );
    spinner.succeed();

    // Print out the component schema.
    console.log(JSON.stringify(result, null, 4));
  },
);

type printStoredComponentSchemaParams = { siteId: string };
export const printStoredComponentSchema =
  errorHandler<printStoredComponentSchemaParams>(
    async ({ siteId }: printStoredComponentSchemaParams) => {
      const spinner = ora("Retrieving component schema...").start();
      const result = await AddOnApiHelper.getServersideComponentSchema(siteId);
      spinner.succeed();

      // Print out the component schema.
      console.log(JSON.stringify(result, null, 4));
    },
  );

type removeStoredComponentSchemaParams = { siteId: string };
export const removeStoredComponentSchema =
  errorHandler<removeStoredComponentSchemaParams>(
    async ({ siteId }: removeStoredComponentSchemaParams) => {
      const spinner = ora("Removing component schema...").start();
      const result = await AddOnApiHelper.removeComponentSchema(siteId);
      spinner.succeed();

      // Print out the component schema.
      console.log(JSON.stringify(result, null, 4));
    },
  );

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
