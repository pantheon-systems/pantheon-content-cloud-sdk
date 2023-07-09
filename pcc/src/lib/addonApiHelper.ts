import axios from 'axios';

const ID_TOKEN =
  'eyJhbGciOiJSUzI1NiIsImtpZCI6IjkzNDFkZWRlZWUyZDE4NjliNjU3ZmE5MzAzMDAwODJmZTI2YjNkOTIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiIxNDI0NzAxOTE1NDEtOG8xNGo3N3B2YWdpc2M2NnM0OGtsNHViOTFmOWM3YjguYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiIxNDI0NzAxOTE1NDEtOG8xNGo3N3B2YWdpc2M2NnM0OGtsNHViOTFmOWM3YjguYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDk2NDc3OTA0MDc3OTgyODA2NDciLCJoZCI6InB1Ymdlbml1cy5pbyIsImVtYWlsIjoib21rYXJAcHViZ2VuaXVzLmlvIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImF0X2hhc2giOiJpazBMNXQ1YlFkX3VQTDBiRGQ0alZRIiwiaWF0IjoxNjg4NzU1NDUwLCJleHAiOjE2ODg3NTkwNTB9.illrKjXyaRaGQtdLCqYk0f_eIdpJS76Xu7zFlg-xnmvbGkD7lJXHllUNxrumRj4KdHE8s97Pez0U-uYBhMFZx8FSikj_z2xc_I0g3o4cyV-mAiun4O7zK68qVDgFAwCbHiNNuq0XBHjJFswfE6RGcimgBDcgsjvzFAdHqS_IpxiXsbOboS3p1EVD8-EawvgYZVDnoRHuoLytUMlsPyFx2mdN4Fg4Ln94D0Y1U-e6Sf4RPO7Y7V3lRx3DfXRb75Vf9LOiLEkB1gayh_0MkraOShB0CnT574vTDbRVBIrpGiVYMKvy1Iz-LN1g-DBV-ubclCNLvFwt6mN1ifwunaW98A';

const API_KEY_ENDPOINT =
  'https://us-central1-pantheon-content-cloud-staging.cloudfunctions.net/addOnApi/api-key';
const OAUTH_ENDPOINT =
  'https://us-central1-pantheon-content-cloud-staging.cloudfunctions.net/addOnApi/oauth';
class AddOnApiHelper {
  static async getToken(code: string): Promise<{
    refreshToken: string;
    accessToken: string;
    idToken: string;
    email: string;
  }> {
    const resp = await axios.post(
      `${OAUTH_ENDPOINT}/token`,
      {
        code: code,
      },
      {
        headers: {
          Authorization: `Bearer ${ID_TOKEN}`,
        },
      },
    );
    return {
      accessToken: resp.data.access_token as string,
      refreshToken: resp.data.refresh_token as string,
      idToken: resp.data.id_token as string,
      email: resp.data.email as string
    };
  }

  static async createApiKey(): Promise<string> {
    const resp = await axios.post(
      API_KEY_ENDPOINT,
      {},
      {
        headers: {
          Authorization: `Bearer ${ID_TOKEN}`,
        },
      },
    );
    return resp.data.apiKey as string;
  }

  static async listApiKeys(): Promise<ApiKey[]> {
    const resp = await axios.get(API_KEY_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${ID_TOKEN}`,
      },
    });

    return resp.data as ApiKey[];
  }

  static async revokeApiKey(id: string): Promise<void> {
    await axios.delete(`${API_KEY_ENDPOINT}/${id}`, {
      headers: {
        Authorization: `Bearer ${ID_TOKEN}`,
      },
    });
  }
}

export default AddOnApiHelper;
