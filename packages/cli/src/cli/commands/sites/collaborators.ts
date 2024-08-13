import ora from "ora";
import AddOnApiHelper from "../../../lib/addonApiHelper";
import { errorHandler } from "../../exceptions";

type listCollaboratorsSchemaParams = { siteId: string };
export const listCollaborators = errorHandler<listCollaboratorsSchemaParams>(
  async ({ siteId }: listCollaboratorsSchemaParams) => {
    const spinner = ora("Retrieving Collaborators...").start();
    const result = await AddOnApiHelper.listCollaborators(siteId);
    spinner.succeed();
    console.log(JSON.stringify(result, null, 4));
  },
);

type removeCollaboratorschemaParams = { siteId: string; email: string };
export const removeCollaborator = errorHandler<removeCollaboratorschemaParams>(
  async ({ siteId, email }: removeCollaboratorschemaParams) => {
    const spinner = ora("Removing Collaborator...").start();
    await AddOnApiHelper.removeCollaborator(siteId, email);
    spinner.succeed();
  },
);

type addCollaboratorschemaParams = { siteId: string; email: string };
export const addCollaborator = errorHandler<addCollaboratorschemaParams>(
  async ({ siteId, email }: addCollaboratorschemaParams) => {
    const spinner = ora("Adding Collaborator...").start();
    await AddOnApiHelper.addCollaborator(siteId, email);
    spinner.succeed();
  },
);
