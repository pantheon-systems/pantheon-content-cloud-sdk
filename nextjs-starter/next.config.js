const path = require("path");

// Load the .env file for local development
// .env.development.local by default
require("dotenv").config({
  path: path.resolve(process.cwd(), ".env.development.local"),
});

if (process.env.PCC_HOST === undefined) {
  let message;
  if (process.env.NODE_ENV === "development") {
    message = `No PCC_HOST found.\nSee the README.md for information on setting this variable locally.`;
  } else if (process.env.NODE_ENV === "production") {
    message = `No PCC_HOST Endpoint found.\nLink to your PCC Instance or set the PCC_HOST environment variable in the settings tab in the dashboard\nIf your site does not require a backend to build, remove this check from the next.config.js.`;
  }
  throw new Error(message);
}

let backendUrl = process.env.PCC_HOST;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    backendUrl: backendUrl,
  },
  output: "standalone",
};

module.exports = nextConfig;
