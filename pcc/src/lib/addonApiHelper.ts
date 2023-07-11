import axios, { HttpStatusCode } from 'axios';
import { getLocalAuthDetails } from './localStorage';
import { HTTPNotFound } from '../cli/exceptions';
import config from './config';

const API_KEY_ENDPOINT = `${config.addOnApiEndpoint}/api-key`;
const OAUTH_ENDPOINT = `${config.addOnApiEndpoint}/oauth`;

class AddOnApiHelper {
  static async getToken(code: string): Promise<{
    refreshToken: string;
    accessToken: string;
    idToken: string;
  }> {
    const resp = await axios.post(`${OAUTH_ENDPOINT}/token`, {
      code: code,
    });
    return {
      accessToken: resp.data.access_token as string,
      refreshToken: resp.data.refresh_token as string,
      idToken: resp.data.id_token as string,
    };
  }

  static async createApiKey(): Promise<string | null> {
    const authDetails = await getLocalAuthDetails();
    if (!authDetails) return null;

    const resp = await axios.post(
      API_KEY_ENDPOINT,
      {},
      {
        headers: {
          Authorization: `Bearer ${authDetails.idToken}`,
        },
      },
    );
    return resp.data.apiKey as string;
  }

  static async listApiKeys(): Promise<ApiKey[]> {
    const authDetails = await getLocalAuthDetails();
    if (!authDetails) return [];

    const resp = await axios.get(API_KEY_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${authDetails.idToken}`,
      },
    });

    return resp.data as ApiKey[];
  }

  static async revokeApiKey(id: string): Promise<void> {
    const authDetails = await getLocalAuthDetails();
    if (!authDetails) return;

    try {
      await axios.delete(`${API_KEY_ENDPOINT}/${id}`, {
        headers: {
          Authorization: `Bearer ${authDetails.idToken}`,
        },
      });
    } catch (err) {
      if (
        (err as { response: { status: number } }).response.status ===
        HttpStatusCode.NotFound
      )
        throw new HTTPNotFound();
    }
  }
}

export default AddOnApiHelper;
