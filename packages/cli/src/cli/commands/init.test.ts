import fs, { readFileSync } from "fs";
import path from "path";
import chalk from "chalk";
import tmp from "tmp";
import { Logger } from "../../lib/logger";
import init, { sh } from "./init";

jest.setTimeout(180000);

const PCC = "./dist/index.js";

test("should be able to init starter kit for nextjs template", async () => {
  const appFolder = tmp.tmpNameSync();
  await sh(PCC, ["init", appFolder, "--template", "nextjs", "--use-pnpm"]);

  // Dependencies are installed
  expect(fs.existsSync(`${appFolder}/node_modules`)).toBe(true);
  expect(fs.existsSync(`${appFolder}/pnpm-lock.yaml`)).toBe(true);

  // Eslint not initialized
  // expect(fs.existsSync(`${appFolder}/.eslintrc.json`)).toBe(false);

  // Checking if primary required files for Nextjs starter kit are created.
  expect(fs.existsSync(`${appFolder}/next.config.js`)).toBe(true);
  expect(fs.existsSync(`${appFolder}/pages/index.jsx`)).toBe(true);

  // package.json checks
  expect(fs.existsSync(`${appFolder}/package.json`)).toBe(true);
  const packageJson = JSON.parse(
    readFileSync(`${appFolder}/package.json`).toString(),
  );
  expect(packageJson.name).toBe(path.parse(appFolder).base);

  // Remove app folder
  fs.rmSync(appFolder, { recursive: true, force: true });
});

test("should be able to init starter kit for gatsby template", async () => {
  const appFolder = tmp.tmpNameSync();
  await sh(PCC, ["init", appFolder, "--template", "gatsby", "--use-pnpm"]);

  // Dependencies are installed
  expect(fs.existsSync(`${appFolder}/node_modules`)).toBe(true);
  expect(fs.existsSync(`${appFolder}/pnpm-lock.yaml`)).toBe(true);

  // Eslint not initialized
  expect(fs.existsSync(`${appFolder}/.eslintrc.json`)).toBe(false);

  // Checking if primary required files for Gatsby starter kit are created.
  expect(fs.existsSync(`${appFolder}/gatsby-browser.js`)).toBe(true);
  expect(fs.existsSync(`${appFolder}/gatsby-config.js`)).toBe(true);
  expect(fs.existsSync(`${appFolder}/gatsby-browser.js`)).toBe(true);

  // package.json checks
  expect(fs.existsSync(`${appFolder}/package.json`)).toBe(true);
  const packageJson = JSON.parse(
    readFileSync(`${appFolder}/package.json`).toString(),
  );
  expect(packageJson.name).toBe(path.parse(appFolder).base);

  // Remove app folder
  fs.rmSync(appFolder, { recursive: true, force: true });
});

test("should be able to init starter kit for nextjs template with typescript", async () => {
  const appFolder = tmp.tmpNameSync();
  await sh(PCC, [
    "init",
    appFolder,
    "--template",
    "nextjs",
    "--use-pnpm",
    "--ts",
  ]);

  // Dependencies are installed
  expect(fs.existsSync(`${appFolder}/node_modules`)).toBe(true);
  expect(fs.existsSync(`${appFolder}/pnpm-lock.yaml`)).toBe(true);

  // Eslint not initialized
  // expect(fs.existsSync(`${appFolder}/.eslintrc.json`)).toBe(false);

  // Checking if primary required files for Nextjs starter kit are created.
  expect(fs.existsSync(`${appFolder}/next.config.js`)).toBe(true);
  expect(fs.existsSync(`${appFolder}/pages/index.tsx`)).toBe(true);

  // package.json checks
  expect(fs.existsSync(`${appFolder}/package.json`)).toBe(true);
  const packageJson = JSON.parse(
    readFileSync(`${appFolder}/package.json`).toString(),
  );
  expect(packageJson.name).toBe(path.parse(appFolder).base);

  // Remove app folder
  fs.rmSync(appFolder, { recursive: true, force: true });
});

test("should be able to init starter kit for gatsby template with typescript", async () => {
  const appFolder = tmp.tmpNameSync();
  await sh(PCC, [
    "init",
    appFolder,
    "--template",
    "gatsby",
    "--use-pnpm",
    "--ts",
  ]);

  // Dependencies are installed
  expect(fs.existsSync(`${appFolder}/node_modules`)).toBe(true);
  expect(fs.existsSync(`${appFolder}/pnpm-lock.yaml`)).toBe(true);

  // Check that TypesScript source files exist.
  expect(fs.existsSync(`${appFolder}/src/templates/index.tsx`)).toBe(true);

  // Eslint not initialized
  expect(fs.existsSync(`${appFolder}/.eslintrc.json`)).toBe(false);

  // Checking if primary required files for Gatsby starter kit are created
  expect(fs.existsSync(`${appFolder}/gatsby-browser.js`)).toBe(true);
  expect(fs.existsSync(`${appFolder}/gatsby-config.js`)).toBe(true);
  expect(fs.existsSync(`${appFolder}/gatsby-browser.js`)).toBe(true);

  // package.json checks
  expect(fs.existsSync(`${appFolder}/package.json`)).toBe(true);
  const packageJson = JSON.parse(
    readFileSync(`${appFolder}/package.json`).toString(),
  );
  expect(packageJson.name).toBe(path.parse(appFolder).base);

  // Remove app folder
  fs.rmSync(appFolder, { recursive: true, force: true });
});

test("should be able to init starter kit with eslint and app name", async () => {
  const appFolder = tmp.tmpNameSync();
  await sh(PCC, [
    "init",
    appFolder,
    "--appName",
    "test_app",
    "--template",
    "nextjs",
    "--noInstall",
    "--eslint",
  ]);

  // Eslint is initialized
  expect(fs.existsSync(`${appFolder}/.eslintrc.json`)).toBe(true);

  // Package.json checks
  expect(fs.existsSync(`${appFolder}/package.json`)).toBe(true);
  const packageJson = JSON.parse(
    readFileSync(`${appFolder}/package.json`).toString(),
  );
  expect(packageJson.name).toBe("test_app");

  // Remove app folder
  fs.rmSync(appFolder, { recursive: true, force: true });
});

test("should raise error when project directory already exists", async () => {
  const appFolder = tmp.tmpNameSync();
  const loggerSpy = jest
    .spyOn(Logger.prototype, "error")
    .mockImplementation(() => null);
  const exitSpy = jest.spyOn(process, "exit").mockImplementation(() => {
    throw Error("TEST_ERROR");
  });
  fs.mkdirSync(appFolder);

  try {
    await init({
      dirName: appFolder,
      template: "nextjs",
      packageManager: "npm",
      skipInstallation: true,
      eslint: false,
      silentLogs: true,
      useTypescript: true,
    });
  } catch (err) {
    expect(loggerSpy).toBeCalledWith(
      chalk.red("ERROR: Project directory already exists."),
    );
    expect(exitSpy).toBeCalledWith(1);
  }

  // No files are created
  expect(fs.readdirSync(appFolder).length).toBe(0);

  // Remove app folder
  fs.rmSync(appFolder, { recursive: true, force: true });
});

test("should raise error when template name is incorrect", async () => {
  const appFolder = tmp.tmpNameSync();

  let error = 0;
  try {
    await sh(PCC, [
      "init",
      appFolder,
      "--appName",
      "test_app",
      "--template",
      "react",
      "--noInstall",
      "--eslint",
    ]);
  } catch (err) {
    error = 1;
  }

  expect(error).toBe(1);

  // No files are created
  expect(fs.existsSync(appFolder)).toBe(false);

  // Remove app folder
  fs.rmSync(appFolder, { recursive: true, force: true });
});
