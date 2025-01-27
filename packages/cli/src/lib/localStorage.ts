import { readFileSync, writeFileSync } from "fs";
import path from "path";
import { ensureFile, remove } from "fs-extra";
import { PCC_ROOT_DIR } from "../constants";
import { Config } from "../types/config";

export const AUTH_FILE_PATH = path.join(PCC_ROOT_DIR, "auth.json");
export const GOOGLE_AUTH_FILE_PATH = path.join(PCC_ROOT_DIR, "google.json");
export const CONFIG_FILE_PATH = path.join(PCC_ROOT_DIR, "config.json");

export const getLocalConfigDetails = async (): Promise<Config | null> => {
  try {
    return JSON.parse(readFileSync(CONFIG_FILE_PATH).toString());
  } catch (_err) {
    return null;
  }
};

export const persistConfigDetails = async (payload: Config): Promise<void> => {
  await persistDetailsToFile(payload, CONFIG_FILE_PATH);
};

export const deleteConfigDetails = async () => remove(CONFIG_FILE_PATH);

export const persistDetailsToFile = async (
  payload: unknown,
  filePath: string,
) => {
  await new Promise<void>((resolve, reject) =>
    ensureFile(filePath, (err: unknown) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    }),
  );

  writeFileSync(filePath, JSON.stringify(payload, null, 2));
};
