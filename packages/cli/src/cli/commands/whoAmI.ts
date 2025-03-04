import { parseJwt } from "@pantheon-systems/pcc-sdk-core";
import chalk from "chalk";
import { Credentials } from "google-auth-library";
import {
  CREDENTIAL_TYPE,
  getLocalAuthDetails,
  JwtCredentials,
} from "../../lib/localStorage";
import { errorHandler } from "../exceptions";

const printWhoAmI = async () => {
  try {
    const nextJwt = (await getLocalAuthDetails(
      CREDENTIAL_TYPE.NEXT_JWT,
    )) as JwtCredentials | null;
    if (!nextJwt) {
      console.log("You aren't logged in.");
    } else {
      console.log(`You're logged in as ${nextJwt.email}`);
    }
  } catch (e) {
    chalk.red("Something went wrong - couldn't retrieve auth info.");
    throw e;
  }

  try {
    const authData = (await getLocalAuthDetails(
      CREDENTIAL_TYPE.OAUTH,
    )) as Credentials | null;
    if (!authData) {
      console.log(
        "You aren't logged into oauth. For some actions, the oauth connection isn't necessary. If you run a command that requires it, you will be only prompted to log in with oauth at that point.",
      );
    } else {
      const jwtPayload = parseJwt(authData.id_token as string);
      console.log(`Oauth: You're logged in as ${jwtPayload.email}`);
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
