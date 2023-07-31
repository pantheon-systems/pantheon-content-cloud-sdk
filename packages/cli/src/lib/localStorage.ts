import { writeFileSync, readFileSync } from 'fs';
import { ensureFile } from 'fs-extra';
import { PCC_ROOT_DIR } from '../constants';
import { Credentials } from 'google-auth-library';
import AddOnApiHelper from './addonApiHelper';

export const AUTH_FILE_PATH = `${PCC_ROOT_DIR}/auth.json`;
export const getLocalAuthDetails = async (): Promise<Credentials | null> => {
  let credentials: Credentials;
  try {
    credentials = JSON.parse(
      readFileSync(AUTH_FILE_PATH).toString(),
    ) as Credentials;
  } catch (_err) {
    return null;
  }

  // Check if token is expired
  if (credentials.expiry_date && credentials.expiry_date > Date.now())
    return credentials;

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

export const persistAuthDetails = async (
  payload: Credentials,
): Promise<void> => {
  await new Promise<void>((resolve, reject) =>
    ensureFile(AUTH_FILE_PATH, (err: any) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    }),
  );

  writeFileSync(AUTH_FILE_PATH, JSON.stringify(payload, null, 2));
};
