import { PantheonClient } from "@pantheon-systems/pcc-react-sdk";

function ensureEnvVariable(name) {
  if (process.env[name] == null) {
    if (process.env.NODE_ENV === "development") {
      throw new Error(
        `No ${name} found.\nSee the README.md for information on setting this variable locally.`
      );
    } else if (process.env.NODE_ENV === "production") {
      throw new Error(
        `No ${name} Endpoint found.\nLink to your PCC Instance or set the ${name} environment variable in the settings tab in the dashboard\nIf your site does not require a backend to build, remove this check from the next.config.js.`
      );
    }
  }
}

ensureEnvVariable("PCC_HOST");
ensureEnvVariable("PCC_SITE_ID");
ensureEnvVariable("PCC_API_KEY");

export const pantheonClient = new PantheonClient({
  pccHost: process.env.PCC_HOST,
  siteId: process.env.PCC_SITE_ID,
  apiKey: process.env.PCC_API_KEY,
});
