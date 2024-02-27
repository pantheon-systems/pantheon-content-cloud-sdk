import { errorHandler } from "../../exceptions";

type listAdminsSchemaParams = { siteId: string };
export const listAdminsSchema = errorHandler<listAdminsSchemaParams>(
  async ({ siteId }: listAdminsSchemaParams) => {},
);

type removeAdminSchemaParams = { siteId: string; email: string };
export const removeAdminSchema = errorHandler<removeAdminSchemaParams>(
  async ({ siteId, email }: removeAdminSchemaParams) => {},
);

type addAdminSchemaParams = { siteId: string; email: string };
export const addAdminSchema = errorHandler<addAdminSchemaParams>(
  async ({ siteId, email }: addAdminSchemaParams) => {},
);
