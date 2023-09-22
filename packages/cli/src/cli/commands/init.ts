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
import { Octokit } from "octokit";
import ora from "ora";
import { Logger, SpinnerLogger } from "../../lib/logger";
import { errorHandler } from "../exceptions";

const TEMP_DIR_NAME = path.join(os.tmpdir(), "react_sdk_90723");
const TAR_FILE_NAME = "sdk-repo.tar";
const TEMPLATE_FOLDER_MAP = {
  nextjs: "nextjs-starter",
  gatsby: "gatsby-starter",
};

const WORKSPACE_DEPENDENCY_PATHS = {
  "@pantheon-systems/pcc-react-sdk": ["packages", "react-sdk"],
};

// TODO: Make sure below ESLINT versions are not stale.
// https://getpantheon.atlassian.net/browse/PCC-474
const ESLINT_DEPENDENCIES = {
  eslint: "^8.24.0",
  "eslint-config-next": "^13.1.1",
};

const ESLINT_CONFIG = {
  extends: "next/core-web-vitals",
};

const octokit = new Octokit();
export async function sh(
  cmd: string,
  args: string[],
  displayOutput: boolean = false,
) {
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
  silentLogs,
  eslint,
  appName,
  useTypescript,
}: {
  dirName: string;
  template: CliTemplateOptions;
  skipInstallation: boolean;
  packageManager: PackageManager;
  silentLogs: boolean;
  eslint: boolean;
  appName?: string;
  useTypescript: boolean;
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
  await sh("tar", [
    "xvpf",
    path.join(TEMP_DIR_NAME, TAR_FILE_NAME),
    "-C",
    TEMP_DIR_NAME,
  ]);
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

  // Resolve workspace dependencies
  Object.keys(WORKSPACE_DEPENDENCY_PATHS).forEach((dep) => {
    const isDep = packageJson.dependencies[dep];
    const isDevDep = packageJson.devDependencies[dep];

    if (!isDep && !isDevDep) return;

    const depPath =
      WORKSPACE_DEPENDENCY_PATHS[
        dep as keyof typeof WORKSPACE_DEPENDENCY_PATHS
      ];

    // Resolve dependency version
    const depPackagePath = path.join(
      TEMP_DIR_NAME,
      "pantheon-sdk",
      ...depPath,
      "package.json",
    );

    const depPackageJson = JSON.parse(
      readFileSync(depPackagePath).toString(),
    ) as {
      version: string;
    };

    const depVersion = depPackageJson.version;

    // Replace workspace identifier with version
    if (isDep) packageJson.dependencies[dep] = depVersion;
    if (isDevDep) packageJson.devDependencies[dep] = depVersion;
  });

  if (eslint) {
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
    template === "gatsby" ? ".env.development" : ".env.local";
  await sh("cp", [".env.example", localEnvFileName]);

  if (!skipInstallation) {
    // Installing dependencies
    new SpinnerLogger("Installing dependencies...", silentLogs).info();
    try {
      await sh(packageManager, ["install"], true);
    } catch (e) {
      console.error(e);
      throw e;
    }

    new SpinnerLogger("", silentLogs).succeed("Installed dependencies!");
  }

  // Cleaning up
  process.chdir("../");
  rmSync(TEMP_DIR_NAME, { recursive: true });

  // Messaging to get started
  logger.log();
  logger.log(
    chalk.green(
      `To get started please replace the placeholders in ${localEnvFileName}`,
    ),
  );
  logger.log(chalk.green(`   cd ${dirName}`));
  logger.log(chalk.green(`   vim .env.local`));
  logger.log(chalk.green("And then run the website"));
  if (template === "nextjs") logger.log(chalk.green("   yarn dev"));
  else logger.log(chalk.green("   yarn start"));
};

export default errorHandler<{
  dirName: string;
  template: CliTemplateOptions;
  packageManager: PackageManager;
  skipInstallation: boolean;
  silentLogs: boolean;
  eslint: boolean;
  appName?: string;
  useTypescript: boolean;
}>(init);
