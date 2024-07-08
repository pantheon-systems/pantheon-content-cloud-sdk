import ora from "ora";
import AddOnApiHelper from "../../../lib/addonApiHelper";
import { errorHandler } from "../../exceptions";

type listAdminsSchemaParams = { siteId: string };
export const listAdminsSchema = errorHandler<listAdminsSchemaParams>(
  async ({ siteId }: listAdminsSchemaParams) => {
    const spinner = ora("Retrieving admins...").start();
    const result = await AddOnApiHelper.listAdmins(siteId);
    spinner.succeed();
    console.log(JSON.stringify(result, null, 4));
  },
);

type removeAdminSchemaParams = { siteId: string; email: string };
export const removeAdminSchema = errorHandler<removeAdminSchemaParams>(
  async ({ siteId, email }: removeAdminSchemaParams) => {
    const spinner = ora("Removing admin...").start();
    await AddOnApiHelper.removeAdmin(siteId, email);
    spinner.succeed();
  },
);

type addAdminSchemaParams = { siteId: string; email: string };
export const addAdminSchema = errorHandler<addAdminSchemaParams>(
  async ({ siteId, email }: addAdminSchemaParams) => {
    const spinner = ora("Adding admin...").start();
    await AddOnApiHelper.addAdmin(siteId, email);
    spinner.succeed();
  },
);
