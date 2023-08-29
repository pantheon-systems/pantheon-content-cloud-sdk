import fs, { readFileSync } from "fs";
import tmp from "tmp";
import init, { sh } from "./init";
import logout from "./logout";

jest.setTimeout(120000);

const PCC = "./dist/index.js";

beforeAll(async () => {
  await sh("pnpm run build:staging");
});

test("should be able to init starter kit for nextjs template", async () => {
  const appFolder = tmp.tmpNameSync();
  await sh(`${PCC} init ${appFolder} --template nextjs --noInstall`);

  // Dependencies are not installed
  expect(fs.existsSync(`${appFolder}/node_modules`)).toBe(false);

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
  expect(packageJson.name).toBe(appFolder);

  // Remove app folder
  fs.rmSync(appFolder, { recursive: true, force: true });
});

test("should be able to init starter kit for gatsby template", async () => {
  const appFolder = tmp.tmpNameSync();
  await sh(`${PCC} init ${appFolder} --template gatsby --noInstall`);

  // Dependencies are not installed
  expect(fs.existsSync(`${appFolder}/node_modules`)).toBe(false);

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
  expect(packageJson.name).toBe(appFolder);

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

test("should not do anything when project directory already exists", async () => {
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

test("should be able to install dependencies", async () => {
  const appFolder = tmp.tmpNameSync();
  await sh(
    `${PCC} init ${appFolder} --appName test_app --template nextjs --use-pnpm --eslint`,
  );

  // Dependencies are installed
  expect(fs.existsSync(`${appFolder}/node_modules`)).toBe(true);
  expect(fs.existsSync(`${appFolder}/pnpm-lock.yaml`)).toBe(true);
  // Remove app folder
  fs.rmSync(appFolder, { recursive: true, force: true });
});
