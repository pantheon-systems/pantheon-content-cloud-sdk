import { readFileSync, writeFileSync } from "fs";
import path from "path";
import { ensureFile, remove } from "fs-extra";
import { Credentials } from "google-auth-library";
import { PCC_ROOT_DIR } from "../constants";
import { Config } from "../types/config";
import AddOnApiHelper from "./addonApiHelper";

export const AUTH_FOLDER_PATH = path.join(PCC_ROOT_DIR, "auth");
export const CONFIG_FILE_PATH = path.join(PCC_ROOT_DIR, "config.json");

function getAuthFile(credentialType: CREDENTIAL_TYPE) {
  return path.join(AUTH_FOLDER_PATH, `${credentialType}.json`);
}

export enum CREDENTIAL_TYPE {
  OAUTH = "OAUTH",
  NEXT_JWT = "NEXT_JWT",
}

export interface NextJwtCredentials {
  token: string;
  email: string;
  expiration: string;
}

export const getLocalAuthDetails = async (
  credentialType: CREDENTIAL_TYPE,
  requiredScopes?: string[],
): Promise<Credentials | NextJwtCredentials | null> => {
  let storedJSON;

  try {
    storedJSON = JSON.parse(
      readFileSync(getAuthFile(credentialType)).toString(),
    );
  } catch (_err) {
    return null;
  }

  if (credentialType == CREDENTIAL_TYPE.OAUTH) {
    const credentials: Credentials = storedJSON as Credentials;

    // Return null if required scope is not present
    const grantedScopes = new Set(credentials.scope?.split(" ") || []);
    if (
      requiredScopes &&
      requiredScopes.length > 0 &&
      !requiredScopes.every((i) => grantedScopes.has(i))
    ) {
      return null;
    }

    // Check if token is expired
    if (credentials.expiry_date) {
      const currentTime = await AddOnApiHelper.getCurrentTime();

      if (currentTime < credentials.expiry_date) {
        return credentials;
      }
    }

    try {
      const newCred = await AddOnApiHelper.refreshToken(
        credentials.refresh_token as string,
      );
      persistAuthDetails(newCred, CREDENTIAL_TYPE.OAUTH);
      return newCred;
    } catch (_err) {
      return null;
    }
  } else {
    const credentials: NextJwtCredentials = storedJSON as NextJwtCredentials;

    // Check if token is expired
    if (credentials.expiration) {
      if (Date.now() >= Date.parse(credentials.expiration)) {
        return null;
      }
    }

    return credentials;
  }
};

export const getLocalConfigDetails = async (): Promise<Config | null> => {
  try {
    return JSON.parse(readFileSync(CONFIG_FILE_PATH).toString());
  } catch (_err) {
    return null;
  }
};

export const persistAuthDetails = async (
  payload: Credentials | NextJwtCredentials,
  credentialType: CREDENTIAL_TYPE,
): Promise<void> => {
  await persistDetailsToFile(payload, getAuthFile(credentialType));
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
