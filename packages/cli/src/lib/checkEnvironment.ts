import chalk from "chalk";
import { TargetEnvironment } from "./apiConfig";
import { getConfigDetails } from "./localStorage";

export const checkEnvironment = async () => {
  const config = await getConfigDetails();
  const env =
    config?.targetEnvironment ||
    (process.env.NODE_ENV as TargetEnvironment) ||
    "production";
  if (env !== TargetEnvironment.production)
    console.log(
      chalk.yellow(
        `WARNING: This CLI build is pointing to "${env}" environment.`,
      ),
    );
};
