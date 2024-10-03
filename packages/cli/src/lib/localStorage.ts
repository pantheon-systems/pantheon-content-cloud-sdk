import { readFileSync, writeFileSync } from "fs";
import path from "path";
import { ensureFile, remove } from "fs-extra";
import { Credentials } from "google-auth-library";
import { PCC_ROOT_DIR } from "../constants";
import { Config } from "../types/config";

export const AUTH_FOLDER_PATH = path.join(PCC_ROOT_DIR, "auth");
export const CONFIG_FILE_PATH = path.join(PCC_ROOT_DIR, "config.json");

function getAuthFile() {
  return path.join(AUTH_FOLDER_PATH, "auth.json");
}

export interface JwtCredentials {
  idToken: string;
  oauthToken: string;
  email: string;
  expiration: string;
}

export const getLocalAuthDetails = async (
): Promise<Credentials | JwtCredentials | null> => {
  let storedJSON;

  try {
    storedJSON = JSON.parse(
      readFileSync(getAuthFile()).toString(),
    );
  } catch (_err) {
    return null;
  }

    const credentials: JwtCredentials = storedJSON as JwtCredentials;

    // Check if token is expired
    if (credentials.expiration) {
      if (Date.now() >= Date.parse(credentials.expiration)) {
        return null;
      }
    }

    return credentials;
};

export const getLocalConfigDetails = async (): Promise<Config | null> => {
  try {
    return JSON.parse(readFileSync(CONFIG_FILE_PATH).toString());
  } catch (_err) {
    return null;
  }
};

export const persistAuthDetails = async (
  payload: Credentials | JwtCredentials,
): Promise<void> => {
  await persistDetailsToFile(payload, getAuthFile());
};

export const persistConfigDetails = async (payload: Config): Promise<void> => {
  await persistDetailsToFile(payload, CONFIG_FILE_PATH);
};

export const deleteConfigDetails = async () => remove(CONFIG_FILE_PATH);

const persistDetailsToFile = async (payload: unknown, filePath: string) => {
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
