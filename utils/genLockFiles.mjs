import { exec } from "child_process";
import fs from "fs";
import path from "path";
import { promisify } from "util";

const execAsync = promisify(exec);

async function generateLockfiles(projectPath) {
  try {
    const lockfileDir = path.join(projectPath, ".lockfiles");
    if (!fs.existsSync(lockfileDir)) {
      fs.mkdirSync(lockfileDir);
    }

    // Commands to generate lockfiles
    const commands = [
      "npm i --package-lock-only",
      "pnpm i --lockfile-only",
      "yarn install",
    ];

    for (const cmd of commands) {
      console.log(`Running ${cmd} in ${projectPath}`);
      try {
        await execAsync(cmd, { cwd: projectPath, shell: true });
      } catch (error) {
        console.error(`Error running ${cmd} in ${projectPath}: ${error}`);
      }
    }

    // Move lockfiles to .lockfiles directory
    const lockfiles = ["package-lock.json", "pnpm-lock.yaml", "yarn.lock"];
    lockfiles.forEach((lockfile) => {
      const src = path.join(projectPath, lockfile);
      if (fs.existsSync(src)) {
        fs.renameSync(src, path.join(lockfileDir, lockfile));
      } else {
        console.log(`Lockfile ${src} does not exist`);
      }
    });
  } catch (error) {
    console.error(`Error processing ${projectPath}: ${error}`);
  }
}

async function processProjects(parentDirectory) {
  const projects = fs.readdirSync(parentDirectory).filter((folder) => {
    const projectPath = path.join(parentDirectory, folder);
    return fs.statSync(projectPath).isDirectory();
  });

  const promises = projects.map((project) =>
    generateLockfiles(path.join(parentDirectory, project)),
  );

  await Promise.all(promises);
}

// Replace with your actual directory path
const parentDirectory = "./";
processProjects(parentDirectory)
  .then(() => console.log("Lockfiles generated for all projects."))
  .catch((error) => console.error(`Error: ${error}`));
