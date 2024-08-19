import { existsSync, rmSync } from "fs";
import ora from "ora";
import { AUTH_FOLDER_PATH } from "../../lib/localStorage";
import { errorHandler } from "../exceptions";

const logout = async () => {
  const spinner = ora("Logging you out...").start();
  try {
    if (existsSync(AUTH_FOLDER_PATH))
      rmSync(AUTH_FOLDER_PATH, {
        recursive: true,
      });
    spinner.succeed("Successfully logged you out from PPC client!");
  } catch (e) {
    spinner.fail();
    throw e;
  }
};

export default errorHandler<void>(logout);

export const LOGOUT_EXAMPLES = [
  { description: "Logout the user", command: "$0 logout" },
];
