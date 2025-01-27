import { parseJwt } from "@pantheon-systems/pcc-sdk-core";
import chalk from "chalk";
import { Auth0Provider } from "../../lib/auth";
import { errorHandler } from "../exceptions";

const printWhoAmI = async () => {
  try {
    const provider = new Auth0Provider();
    const tokens = await provider.getTokens();
    if (!tokens) {
      console.log("You aren't logged in.");
    } else {
      const jwtPayload = parseJwt(tokens.access_token as string);
      console.log(`You're logged in as ${jwtPayload["pcc/email"]}`);
    }
  } catch (e) {
    chalk.red("Something went wrong - couldn't retrieve auth info.");
    throw e;
  }
};

export default errorHandler<void>(printWhoAmI);

export const WHOAMI_EXAMPLES = [
  {
    description: "Get details of logged-in user",
    command: "$0 whoami",
  },
];
