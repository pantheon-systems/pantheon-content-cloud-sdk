const path = require("path");

// Load the .env file for local development
// .env.development.local by default
require("dotenv").config({
  path: path.resolve(process.cwd(), ".env.development.local"),
});

function ensureEnvVariable(name) {
  if (process.env[name] == null) {
    if (process.env.NODE_ENV === "development") {
      throw new Error(
        `No ${name} found.\nSee the README.md for information on setting this variable locally.`,
      );
    } else if (process.env.NODE_ENV === "production") {
      throw new Error(
        `No ${name} Endpoint found.\nLink to your PCC Instance or set the ${name} environment variable in the settings tab in the dashboard\nIf your site does not require a backend to build, remove this check from the next.config.js.`,
      );
    }
  }
}

if (process.env.IS_CICD !== "true") {
  ensureEnvVariable("PCC_SITE_ID");
  ensureEnvVariable("PCC_API_KEY");
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    PCC_HOST: process.env.PCC_HOST,
    PCC_SITE_ID: process.env.PCC_SITE_ID,
    PCC_API_KEY: process.env.PCC_API_KEY,
  },
  output: "standalone",
};

module.exports = nextConfig;
