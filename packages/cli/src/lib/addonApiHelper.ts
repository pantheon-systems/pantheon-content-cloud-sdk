import axios, { HttpStatusCode } from "axios";
import { Credentials } from "google-auth-library";
import { HTTPNotFound, UserNotLoggedIn } from "../cli/exceptions";
import config from "./config";
import { getLocalAuthDetails } from "./localStorage";

const API_KEY_ENDPOINT = `${config.addOnApiEndpoint}/api-key`;
const SITE_ENDPOINT = `${config.addOnApiEndpoint}/sites`;
const OAUTH_ENDPOINT = `${config.addOnApiEndpoint}/oauth`;

class AddOnApiHelper {
  static async getToken(code: string): Promise<Credentials> {
    const resp = await axios.post(`${OAUTH_ENDPOINT}/token`, {
      code: code,
    });
    return resp.data as Credentials;
  }
  static async refreshToken(refreshToken: string): Promise<Credentials> {
    const resp = await axios.post(`${OAUTH_ENDPOINT}/refresh`, {
      refreshToken,
    });
    return resp.data as Credentials;
  }

  static async createApiKey(): Promise<string> {
    const authDetails = await getLocalAuthDetails();
    if (!authDetails) throw new UserNotLoggedIn();

    const resp = await axios.post(
      API_KEY_ENDPOINT,
      {},
      {
        headers: {
          Authorization: `Bearer ${authDetails.id_token}`,
        },
      },
    );
    return resp.data.apiKey as string;
  }

  static async listApiKeys(): Promise<ApiKey[]> {
    const authDetails = await getLocalAuthDetails();
    if (!authDetails) throw new UserNotLoggedIn();

    const resp = await axios.get(API_KEY_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${authDetails.id_token}`,
      },
    });

    return resp.data as ApiKey[];
  }

  static async revokeApiKey(id: string): Promise<void> {
    const authDetails = await getLocalAuthDetails();
    if (!authDetails) throw new UserNotLoggedIn();

    try {
      await axios.delete(`${API_KEY_ENDPOINT}/${id}`, {
        headers: {
          Authorization: `Bearer ${authDetails.id_token}`,
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

  static async createSite(url: string): Promise<string> {
    const authDetails = await getLocalAuthDetails();
    if (!authDetails) throw new UserNotLoggedIn();

    const resp = await axios.post(
      SITE_ENDPOINT,
      { name: "", url, emailList: "" },
      {
        headers: {
          Authorization: `Bearer ${authDetails.id_token}`,
        },
      },
    );
    return resp.data.id as string;
  }

  static async listSites(): Promise<Site[]> {
    const authDetails = await getLocalAuthDetails();
    if (!authDetails) throw new UserNotLoggedIn();

    const resp = await axios.get(SITE_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${authDetails.id_token}`,
      },
    });

    return resp.data as Site[];
  }

  static async updateSite(id: string, url: string): Promise<void> {
    const authDetails = await getLocalAuthDetails();
    if (!authDetails) throw new UserNotLoggedIn();

    await axios.patch(
      `${SITE_ENDPOINT}/${id}`,
      { url },
      {
        headers: {
          Authorization: `Bearer ${authDetails.id_token}`,
        },
      },
    );
  }

  static async updateSiteConfig(
    id: string,
    {
      url,
      webhookUrl,
      webhookSecret,
    }: {
      url?: string;
      webhookUrl?: string;
      webhookSecret?: string;
    },
  ): Promise<void> {
    const authDetails = await getLocalAuthDetails();
    if (!authDetails) throw new UserNotLoggedIn();

    const configuredWebhook = webhookUrl || webhookSecret;

    await axios.patch(
      `${SITE_ENDPOINT}/${id}`,
      {
        ...(url && { url: url }),
        ...(configuredWebhook && {
          webhookConfig: {
            ...(webhookUrl && { webhookUrl: webhookUrl }),
            ...(webhookSecret && { webhookSecret: webhookUrl }),
          },
        }),
      },
      {
        headers: {
          Authorization: `Bearer ${authDetails.id_token}`,
        },
      },
    );
  }
}

export default AddOnApiHelper;
