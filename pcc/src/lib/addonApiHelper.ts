import axios from 'axios';
import { getLocalAuthDetails } from './localStorage';

const API_KEY_ENDPOINT =
  'https://us-central1-pantheon-content-cloud-staging.cloudfunctions.net/addOnApi/api-key';
const OAUTH_ENDPOINT =
  'https://us-central1-pantheon-content-cloud-staging.cloudfunctions.net/addOnApi/oauth';
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

    await axios.delete(`${API_KEY_ENDPOINT}/${id}`, {
      headers: {
        Authorization: `Bearer ${authDetails.idToken}`,
      },
    });
  }
}

export default AddOnApiHelper;
