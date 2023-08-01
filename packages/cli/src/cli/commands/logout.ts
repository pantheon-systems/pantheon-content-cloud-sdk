import { existsSync, rmSync } from "fs";
import ora from "ora";
import { AUTH_FILE_PATH } from "../../lib/localStorage";
import { errorHandler } from "../exceptions";

const logout = async () => {
  const spinner = ora("Logging you out...").start();
  try {
    if (existsSync(AUTH_FILE_PATH)) rmSync(AUTH_FILE_PATH);
    spinner.succeed("Successfully logged you out from PPC client!");
  } catch (e) {
    spinner.fail();
    throw e;
  }
};

export default errorHandler<void>(logout);
