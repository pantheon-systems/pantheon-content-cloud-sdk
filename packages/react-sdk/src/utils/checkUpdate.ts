import fs from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";
import boxen from "boxen";
import chalk from "chalk";
import pkgJson from "package-json";
import semver from "semver";

const checkUpdate = async () => {
  const { name, version } = JSON.parse(
    fs.readFileSync(__dirname + "/../package.json").toString(),
  );
  const { version: latestVersion } = await pkgJson(name);
  // check if local package version is less than the remote version
  const updateAvailable = semver.lt(version, latestVersion as string);
  if (updateAvailable) {
    // check the type of version difference which is usually patch, minor, major etc.
    const msg = {
      updateAvailable: `Update available! ${chalk.dim(version)} → ${chalk.green(
        latestVersion,
      )}`,
      runUpdate: `Run ${chalk.cyan(`npm i -g ${name}`)} to update`,
    };

    // notify the user about the available update
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
