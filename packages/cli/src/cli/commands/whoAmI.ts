import { parseJwt } from "@pantheon-systems/pcc-sdk-core";
import chalk from "chalk";
import { getLocalAuthDetails } from "../../lib/localStorage";
import { errorHandler } from "../exceptions";

const printWhoAmI = async () => {
  try {
    const authData = await getLocalAuthDetails();
    if (!authData) {
      console.log("You aren't logged in.");
    } else {
      const jwtPayload = parseJwt(authData.id_token as string);
      console.log(`You're logged in as ${jwtPayload.email}`);
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
