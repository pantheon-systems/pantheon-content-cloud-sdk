import fs, { readFileSync, writeFileSync } from "fs";
import path from "path";
import tmp from "tmp";
import { sh } from "../../lib/utils";

jest.setTimeout(180000);

const PCC = "./dist/index.js";

const TEST_SIDE_ID = process.env.PCC_SITE_ID;
const TEST_TOKEN = process.env.PCC_TOKEN;
const ENV_CONTENT = `
PCC_SITE_ID=${TEST_SIDE_ID}
PCC_TOKEN=${TEST_TOKEN}

`;
const defaultArgs = ["--non-interactive", "--noInstall", "--verbose"];

const executePCC = async (command: string, args: string[]) => {
  try {
    return await sh("node", [PCC, command, ...args, ...defaultArgs], true);
  } catch (e) {
    console.error("executePCC encountered an issue", e, "args used:", [
      PCC,
      command,
      ...args,
      ...defaultArgs,
    ]);
    throw e;
  }
};

// test("should be able to init starter kit for nextjs template", async () => {
//   const appFolder = tmp.tmpNameSync();

//   await executePCC("init", [appFolder, "--template", "nextjs", "--use-pnpm"]);

//   // Eslint not initialized
//   expect(fs.existsSync(`${appFolder}/.eslintrc.json`)).toBe(false);

//   // Checking if primary required files for Nextjs starter kit are created.
//   expect(fs.existsSync(`${appFolder}/next.config.js`)).toBe(true);
//   expect(fs.existsSync(`${appFolder}/pages/index.jsx`)).toBe(true);

//   // package.json checks
//   expect(fs.existsSync(`${appFolder}/package.json`)).toBe(true);
//   const packageJson = JSON.parse(
//     readFileSync(`${appFolder}/package.json`).toString(),
//   );
//   expect(packageJson.name).toBe(path.parse(appFolder).base);

//   // Remove app folder
//   fs.rmSync(appFolder, { recursive: true, force: true });
// });

// test("should be able to init starter kit for gatsby template", async () => {
//   const appFolder = tmp.tmpNameSync();

//   await executePCC("init", [appFolder, "--template", "gatsby", "--use-pnpm"]);

//   // Eslint not initialized
//   expect(fs.existsSync(`${appFolder}/.eslintrc.json`)).toBe(false);

//   // Checking if primary required files for Gatsby starter kit are created.
//   expect(fs.existsSync(`${appFolder}/gatsby-browser.js`)).toBe(true);
//   expect(fs.existsSync(`${appFolder}/gatsby-config.js`)).toBe(true);
//   expect(fs.existsSync(`${appFolder}/gatsby-browser.js`)).toBe(true);

//   // package.json checks
//   expect(fs.existsSync(`${appFolder}/package.json`)).toBe(true);
//   const packageJson = JSON.parse(
//     readFileSync(`${appFolder}/package.json`).toString(),
//   );
//   expect(packageJson.name).toBe(path.parse(appFolder).base);

//   // Remove app folder
//   fs.rmSync(appFolder, { recursive: true, force: true });
// });

test("should be able to init starter kit for nextjs template with typescript", async () => {
  const appFolder = tmp.tmpNameSync();

  await executePCC("init", [
    appFolder,
    "--template",
    "nextjs",
    "--use-pnpm",
    "--ts",
  ]);

  // Eslint not initialized
  expect(fs.existsSync(`${appFolder}/.eslintrc.json`)).toBe(false);

  // Checking if primary required files for Nextjs starter kit are created.
  expect(fs.existsSync(`${appFolder}/next.config.js`)).toBe(true);
  expect(fs.existsSync(`${appFolder}/pages/index.tsx`)).toBe(true);

  // package.json checks
  expect(fs.existsSync(`${appFolder}/package.json`)).toBe(true);
  const packageJson = JSON.parse(
    readFileSync(`${appFolder}/package.json`).toString(),
  );
  expect(packageJson.name).toBe(path.parse(appFolder).base);

  writeFileSync(`${appFolder}/.env.local`, ENV_CONTENT);
  await sh(
    "cd",
    [appFolder, "&&", "pnpm", "install", "&&", "pnpm", "build"],
    true,
  );
  // Remove app folder
  fs.rmSync(appFolder, { recursive: true, force: true });
});

// test("should be able to init starter kit for gatsby template with typescript", async () => {
//   const appFolder = tmp.tmpNameSync();

//   await executePCC("init", [appFolder, "--template", "gatsby", "--ts"]);

//   // Check that TypesScript source files exist.
//   expect(fs.existsSync(`${appFolder}/src/templates/index.tsx`)).toBe(true);

//   // Eslint not initialized
//   expect(fs.existsSync(`${appFolder}/.eslintrc.json`)).toBe(false);

//   // Checking if primary required files for Gatsby starter kit are created
//   expect(fs.existsSync(`${appFolder}/gatsby-browser.js`)).toBe(true);
//   expect(fs.existsSync(`${appFolder}/gatsby-config.js`)).toBe(true);
//   expect(fs.existsSync(`${appFolder}/gatsby-browser.js`)).toBe(true);

//   // package.json checks
//   expect(fs.existsSync(`${appFolder}/package.json`)).toBe(true);
//   const packageJson = JSON.parse(
//     readFileSync(`${appFolder}/package.json`).toString(),
//   );
//   expect(packageJson.name).toBe(path.parse(appFolder).base);

//   // Remove app folder
//   fs.rmSync(appFolder, { recursive: true, force: true });
// });

// test("should be able to init starter kit with eslint and app name", async () => {
//   const appFolder = tmp.tmpNameSync();

//   await executePCC("init", [
//     appFolder,
//     "--appName",
//     "test_app",
//     "--template",
//     "nextjs",
//     "--eslint",
//   ]);

//   // Eslint is initialized
//   expect(fs.existsSync(`${appFolder}/.eslintrc.json`)).toBe(true);

//   // Package.json checks
//   expect(fs.existsSync(`${appFolder}/package.json`)).toBe(true);
//   const packageJson = JSON.parse(
//     readFileSync(`${appFolder}/package.json`).toString(),
//   );
//   expect(packageJson.name).toBe("test_app");

//   // Remove app folder
//   fs.rmSync(appFolder, { recursive: true, force: true });
// });

// test("should raise error when project directory already exists", async () => {
//   const appFolder = tmp.tmpNameSync();
//   fs.mkdirSync(appFolder);

//   let error = false;
//   try {
//     await executePCC("init", [appFolder, "--template", "nextjs", "--eslint"]);
//   } catch (err) {
//     error = true;
//   }

//   // No files are created
//   expect(error).toBe(true);

//   // Remove app folder
//   fs.rmSync(appFolder, { recursive: true, force: true });
// });

// test("should raise error when template name is incorrect", async () => {
//   const appFolder = tmp.tmpNameSync();

//   let error = 0;
//   try {
//     await executePCC("init", [
//       appFolder,
//       "--appName",
//       "test_app",
//       "--template",
//       "react",
//       "--eslint",
//     ]);
//   } catch (err) {
//     error = 1;
//   }

//   expect(error).toBe(1);

//   // No files are created
//   expect(fs.existsSync(appFolder)).toBe(false);

//   // Remove app folder
//   fs.rmSync(appFolder, { recursive: true, force: true });
// });
