import fs from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";
import boxen from "boxen";
import chalk from "chalk";
import pkgJson from "package-json";
import semver from "semver";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const checkUpdate = async () => {
  if(process.env.NODE_ENV === 'test')
    return

  const { name, version } = JSON.parse(
    fs.readFileSync(__dirname + "/../package.json").toString(),
  );
  const { version: latestVersion } = await pkgJson(name);

  const updateAvailable = semver.lt(version, latestVersion as string);
  if (updateAvailable) {
    const msg = {
      updateAvailable: `Update available! ${chalk.dim(version)} → ${chalk.green(
        latestVersion,
      )}.`,
      runUpdate: `Run ${chalk.cyan(`npm i -g ${name}`)} to update.`,
    };

    console.log(
      boxen(`${msg.updateAvailable}\n${msg.runUpdate}`, {
        margin: 1,
        padding: 1,
        align: "center",
      }),
    );
  }
};

export default checkUpdate;
