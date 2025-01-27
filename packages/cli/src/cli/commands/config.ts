import nunjucks from "nunjucks";
import ora from "ora";
import { getApiConfig } from "../../lib/apiConfig";
import * as LocalStorage from "../../lib/localStorage";
import { errorHandler } from "../exceptions";

nunjucks.configure({ autoescape: true });

export const setTargetEnvironment = errorHandler<"production" | "staging">(
  async (target: "production" | "staging") => {
    return new Promise<void>(
      // eslint-disable-next-line no-async-promise-executor -- Handling promise rejection in the executor
      async (resolve, reject) => {
        const spinner = ora("Updating config file").start();
        try {
          await LocalStorage.persistConfigDetails({
            targetEnvironment: target,
          });

          spinner.succeed(`Successfully updated config file`);
          resolve();
        } catch (e) {
          spinner.fail();
          reject(e);
        }
      },
    );
  },
);

export const resetTargetEnvironment = errorHandler<void>((): Promise<void> => {
  return new Promise(
    // eslint-disable-next-line no-async-promise-executor -- Handling promise rejection in the executor
    async (resolve, reject) => {
      const spinner = ora("Deleting config file").start();
      try {
        await LocalStorage.deleteConfigDetails();
        spinner.succeed(`Successfully deleted config file`);
        resolve();
      } catch (e) {
        spinner.fail();
        reject(e);
      }
    },
  );
});

export const printConfigurationData = errorHandler<void>(
  async (): Promise<void> => {
    return new Promise(
      // eslint-disable-next-line no-async-promise-executor -- Handling promise rejection in the executor
      async (resolve, reject) => {
        const spinner = ora("Retrieving configuration data").start();
        try {
          const localConfig = await LocalStorage.getConfigDetails();
          const apiConfig = await getApiConfig();
          console.log(JSON.stringify({ localConfig, apiConfig }, null, 4));
          spinner.succeed(`Successfully retrieved configuration data`);
          resolve();
        } catch (e) {
          spinner.fail();
          reject(e);
        }
      },
    );
  },
);
