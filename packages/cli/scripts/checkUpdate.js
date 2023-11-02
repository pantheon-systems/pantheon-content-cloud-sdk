import * as fs from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";
import boxen from "boxen";
import chalk from "chalk";
import pkgJson from "package-json";
import semver from "semver";
import semverDiff from "semver-diff";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const checkUpdate = async () => {
  const { name, version } = JSON.parse(
    fs.readFileSync(__dirname + "/../package.json"),
  );
  const { version: latestVersion } = await pkgJson(name);

  // check if local package version is less than the remote version
  const updateAvailable = semver.lt(version, latestVersion);

  if (updateAvailable) {
    let updateType = "";

    // check the type of version difference which is usually patch, minor, major etc.
    let verDiff = semverDiff(version, latestVersion);

    if (verDiff) {
      updateType = capitalizeFirstLetter(verDiff);
    }

    const msg = {
      updateAvailable: `${updateType} update available ${chalk.dim(
        version,
      )} → ${chalk.green(latestVersion)}`,
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
checkUpdate();
