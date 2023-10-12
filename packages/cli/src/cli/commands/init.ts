import { spawn } from "child_process";
import {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  renameSync,
  rmSync,
  writeFileSync,
} from "fs";
import os from "os";
import path from "path";
import { chdir, exit } from "process";
import chalk from "chalk";
import inquirer from "inquirer";
import { Octokit } from "octokit";
import AddOnApiHelper from "../../lib/addonApiHelper";
import { Logger, SpinnerLogger } from "../../lib/logger";
import { replaceEnvVariable } from "../../lib/utils";
import { errorHandler } from "../exceptions";

const TEMP_DIR_NAME = path.join(os.tmpdir(), "react_sdk_90723");
const TAR_FILE_NAME = "sdk-repo.tar";
const TEMPLATE_FOLDER_MAP = {
  nextjs: "nextjs-starter",
  gatsby: "gatsby-starter",
  vue: "vue-starter",
};

const ESLINT_DEPENDENCIES = {
  eslint: "latest",
  "eslint-config-next": "latest",
};

const ESLINT_CONFIG = {
  extends: "next/core-web-vitals",
};

const octokit = new Octokit();
export async function sh(cmd: string, args: string[], displayOutput = false) {
  return new Promise(function (resolve, reject) {
    const pr = spawn(cmd, args, {
      stdio: displayOutput ? "inherit" : undefined,
    });
    pr.on("exit", (code) => {
      if (code === 0) resolve(0);
      else reject(`Exited with code: ${code}`);
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
  packageManager = "npm",
  nonInteractive = false,
  siteId = null,
  silentLogs,
  eslint,
  appName,
  useTypescript,
  printVerbose,
}: {
  dirName: string;
  template: CliTemplateOptions;
  skipInstallation: boolean;
  packageManager: PackageManager;
  nonInteractive: boolean;
  siteId?: string | null | undefined;
  silentLogs: boolean;
  eslint: boolean;
  appName?: string;
  useTypescript: boolean;
  printVerbose?: boolean;
}) => {
  const logger = new Logger(silentLogs);
  if (!dirName) {
    logger.error(
      chalk.red(
        "ERROR: Please enter valid directory name. Check pcc init --help for more details.",
      ),
    );
    exit(1);
  }

  if (existsSync(TEMP_DIR_NAME)) rmSync(TEMP_DIR_NAME, { recursive: true });
  mkdirSync(TEMP_DIR_NAME);

  // Cloning starter kit locally
  const fetchStarter = new SpinnerLogger("Fetching starter kit...", silentLogs);
  fetchStarter.start();
  const { data } = await octokit.request("GET /repos/{owner}/{repo}/tarball", {
    owner: "pantheon-systems",
    repo: "pantheon-content-cloud-sdk",
  });
  writeFileSync(path.join(TEMP_DIR_NAME, TAR_FILE_NAME), Buffer.from(data));
  await sh(
    "tar",
    ["xvpf", path.join(TEMP_DIR_NAME, TAR_FILE_NAME), "-C", TEMP_DIR_NAME],
    printVerbose,
  );
  let files = readdirSync(TEMP_DIR_NAME);
  files = files.filter((item) => item !== TAR_FILE_NAME);
  renameSync(
    path.join(TEMP_DIR_NAME, files[0]),
    path.join(TEMP_DIR_NAME, "pantheon-sdk"),
  );
  fetchStarter.succeed("Fetched starter kit!");

  // Setting up new project
  const setupProj = new SpinnerLogger("Setting up project...", silentLogs);
  setupProj.start();
  if (existsSync(dirName)) {
    setupProj.stop();
    logger.error(chalk.red("ERROR: Project directory already exists."));
    exit(1);
  }

  cpSync(
    path.join(
      TEMP_DIR_NAME,
      "pantheon-sdk",
      "starters",
      `${TEMPLATE_FOLDER_MAP[template]}${useTypescript ? "-ts" : ""}`,
    ),
    dirName,
    { recursive: true },
  );
  chdir(dirName);
  const packageJson = JSON.parse(readFileSync("./package.json").toString());
  if (appName) packageJson.name = appName;
  else packageJson.name = path.parse(dirName).base;

  if (eslint && template === "nextjs") {
    packageJson.devDependencies = {
      ...packageJson.devDependencies,
      ...ESLINT_DEPENDENCIES,
    };

    writeFileSync("./.eslintrc.json", JSON.stringify(ESLINT_CONFIG, null, 2));
  }

  writeFileSync("./package.json", JSON.stringify(packageJson, null, 2) + "\n");

  // Committing changes to Git
  await sh("git", ["init"]);
  await sh("git", ["add", "."]);
  await sh("git", [
    "commit",
    "-m",
    '"Initial commit from Pantheon Content Cloud Toolkit."',
  ]);
  setupProj.succeed("Completed setting up project!");

  // Create .env.local/.env.development
  const localEnvFileName =
    template === "gatsby"
      ? ".env.development"
      : template === "vue"
      ? ".env"
      : ".env.local";
  await sh("cp", [".env.example", localEnvFileName]);

  if (!skipInstallation) {
    // Installing dependencies
    new SpinnerLogger("Installing dependencies...", silentLogs).info();
    try {
      await sh(packageManager, ["install"], !silentLogs);
    } catch (e) {
      console.error(e);
      throw e;
    }

    new SpinnerLogger("", silentLogs).succeed("Installed dependencies!");
  }

  let apiKey;

  if (!nonInteractive) {
    if (!siteId) {
      const { chooseSite } = await inquirer.prompt([
        {
          type: "confirm",
          name: "chooseSite",
          message: "Pick site now?",
        },
      ]);

      if (chooseSite) {
        siteId = (
          await inquirer.prompt({
            type: "list",
            name: "siteId",
            choices: (await AddOnApiHelper.listSites())
              .filter((x) => !x.__isPlayground)
              .map((x) => `${x.url} (${x.id})`),
          })
        ).siteId
          .split(" (")[1]
          .replace(")", "");
      }
    }

    const { createNewApiKey } = await inquirer.prompt([
      {
        type: "confirm",
        name: "createNewApiKey",
        message: "Create a new API key?",
      },
    ]);

    if (createNewApiKey) {
      apiKey = await AddOnApiHelper.createApiKey();
    }
  }

  if (apiKey != null || siteId != null) {
    let envFile = readFileSync(localEnvFileName).toString();

    if (siteId != null) {
      envFile = replaceEnvVariable(envFile, "PCC_SITE_ID", siteId);
    }

    if (apiKey != null) {
      envFile = replaceEnvVariable(envFile, "PCC_API_KEY", apiKey);
    }

    writeFileSync(localEnvFileName, envFile);
  }

  // Cleaning up
  process.chdir("../");
  rmSync(TEMP_DIR_NAME, { recursive: true });

  if (apiKey == null || siteId == null) {
    // Messaging to get started
    logger.log();
    logger.log(
      chalk.green(
        `To get started please replace the placeholders in ${localEnvFileName}`,
      ),
    );
    logger.log(chalk.green(`   cd ${dirName}`));
    logger.log(chalk.green(`   vim ${localEnvFileName}`));
    logger.log(chalk.green("And then run the website"));
  } else {
    logger.log(
      chalk.green(
        `You have successfully populated the local environment file. You can edit this at any time by opening ${localEnvFileName}`,
      ),
    );
    logger.log(
      chalk.green(
        "You are now ready to run the website locally, which you can do by executing in the command line:",
      ),
    );
  }

  if (template === "nextjs" || template === "vue")
    logger.log(chalk.green("   yarn dev"));
  else logger.log(chalk.green("   yarn start"));
};

export default errorHandler<{
  dirName: string;
  template: CliTemplateOptions;
  packageManager: PackageManager;
  skipInstallation: boolean;
  nonInteractive: boolean;
  siteId?: string | null | undefined;
  silentLogs: boolean;
  eslint: boolean;
  appName?: string;
  useTypescript: boolean;
  printVerbose?: boolean;
}>(init);
