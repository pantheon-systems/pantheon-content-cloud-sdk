import fs, { readFileSync } from "fs";
import path from "path";
import tmp from "tmp";
import { sh } from "./init";

jest.setTimeout(120000);

const PCC = "./dist/index.js";

beforeAll(async () => {
  await sh("pnpm run build:staging");
});

test("should be able to init starter kit for nextjs template", async () => {
  const appFolder = tmp.tmpNameSync();
  await sh(`${PCC} init ${appFolder} --template nextjs --use-pnpm`);

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
  await sh(`${PCC} init ${appFolder} --template gatsby --use-pnpm`);

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

test("should be able to init starter kit with eslint and app name", async () => {
  const appFolder = tmp.tmpNameSync();
  await sh(
    `${PCC} init ${appFolder} --appName test_app --template nextjs --noInstall --eslint`,
  );

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
  fs.mkdirSync(appFolder);

  let error = 0;
  try {
    await sh(
      `${PCC} init ${appFolder} --appName test_app --template gatsby --noInstall --eslint`,
    );
  } catch (err) {
    error = 1;
  }

  expect(error).toBe(1);

  // No files are created
  expect(fs.readdirSync(appFolder).length).toBe(0);

  // Remove app folder
  fs.rmSync(appFolder, { recursive: true, force: true });
});

test("should raise error when template name is incorrect", async () => {
  const appFolder = tmp.tmpNameSync();

  let error = 0;
  try {
    await sh(
      `${PCC} init ${appFolder} --appName test_app --template react --noInstall --eslint`,
    );
  } catch (err) {
    error = 1;
  }

  expect(error).toBe(1);

  // No files are created
  expect(fs.existsSync(appFolder)).toBe(false);

  // Remove app folder
  fs.rmSync(appFolder, { recursive: true, force: true });
});
