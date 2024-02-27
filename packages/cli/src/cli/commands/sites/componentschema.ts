import { errorHandler } from "../../exceptions";

type pushComponentSchemaParams = { siteId: string; target: string };
export const pushComponentSchema = errorHandler<pushComponentSchemaParams>(
  async ({ siteId, target }: pushComponentSchemaParams) => {},
);

type printStoredComponentSchemaParams = { siteId: string };
export const printStoredComponentSchema =
  errorHandler<printStoredComponentSchemaParams>(
    async ({ siteId }: printStoredComponentSchemaParams) => {},
  );

type removeStoredComponentSchemaParams = { siteId: string };
export const removeStoredComponentSchema =
  errorHandler<removeStoredComponentSchemaParams>(
    async ({ siteId }: removeStoredComponentSchemaParams) => {},
  );
