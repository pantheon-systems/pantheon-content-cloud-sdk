import { readFileSync, writeFileSync } from "fs";
import path from "path";
import { parseJwt } from "@pantheon-systems/pcc-sdk-core";
import { ensureFile, remove } from "fs-extra";
import { PCC_ROOT_DIR } from "../constants";
import { Config } from "../types/config";
import AddOnApiHelper, { PersistedTokens } from "./addonApiHelper";

export const AUTH_FILE_PATH = path.join(PCC_ROOT_DIR, "auth.json");
export const CONFIG_FILE_PATH = path.join(PCC_ROOT_DIR, "config.json");

export const getLocalAuthDetails = async (
  requiredScopes?: string[],
): Promise<PersistedTokens | null> => {
  let credentials: PersistedTokens;
  try {
    credentials = JSON.parse(
      readFileSync(AUTH_FILE_PATH).toString(),
    ) as PersistedTokens;
  } catch (_err) {
    return null;
  }

  // Return null if required scope is not present
  const grantedScopes = new Set(credentials.scope?.split(" ") || []);
  if (
    requiredScopes &&
    requiredScopes.length > 0 &&
    !requiredScopes.every((i) => grantedScopes.has(i))
  ) {
    return null;
  }

  const tokenPayload = parseJwt(credentials.access_token as string);
  // Check if token is expired
  if (tokenPayload.exp) {
    const currentTime = await AddOnApiHelper.getCurrentTime();

    if (currentTime < tokenPayload.exp * 1000) {
      return credentials;
    }
  }

  try {
    const newCred = await AddOnApiHelper.refreshToken(
      credentials.refresh_token as string,
    );
    persistAuthDetails(newCred);
    return newCred;
  } catch (_err) {
    return null;
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
  payload: PersistedTokens,
): Promise<void> => {
  await persistDetailsToFile(payload, AUTH_FILE_PATH);
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
