import { writeFileSync, readFileSync } from 'fs';
import { PCC_ROOT_DIR } from '../constants';

export const AUTH_FILE_PATH = `${PCC_ROOT_DIR}/auth.json`;
export const getLocalAuthDetails = async (): Promise<AuthDetails | null> => {
  try {
    const authJson = JSON.parse(
      readFileSync(AUTH_FILE_PATH).toString(),
    ) as AuthDetails;
    return {
      accessToken: authJson.accessToken,
      refreshToken: authJson.refreshToken,
      idToken: authJson.idToken,
    };
  } catch (_err) {
    return null;
  }
};

export const persistAuthDetails = async (
  payload: AuthDetails,
): Promise<void> => {
  writeFileSync(AUTH_FILE_PATH, JSON.stringify(payload, null, 2));
};
