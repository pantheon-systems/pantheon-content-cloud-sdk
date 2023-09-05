import { fromZodError } from "zod-validation-error";
import { SmartComponentMapZod } from "../types";

export function validateComponentSchema(schema: unknown) {
  const parseResult = SmartComponentMapZod.safeParse(schema);

  if (!parseResult.success) {
    const error = fromZodError(parseResult.error);

    throw new Error(error.message);
  }

  return true;
}
