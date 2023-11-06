import axios, { HttpStatusCode } from "axios";
import { Credentials } from "google-auth-library";
import login from "../cli/commands/login";
import { HTTPNotFound, UserNotLoggedIn } from "../cli/exceptions";
import config from "./config";
import { getLocalAuthDetails } from "./localStorage";

const API_KEY_ENDPOINT = `${config.addOnApiEndpoint}/api-key`;
const SITE_ENDPOINT = `${config.addOnApiEndpoint}/sites`;
const DOCUMENT_ENDPOINT = `${config.addOnApiEndpoint}/articles`;
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

  static async getCurrentTime(): Promise<number> {
    try {
      const resp = await axios.get(`${config.addOnApiEndpoint}/ping`);
      return Number(resp.data.timestamp);
    } catch {
      // If ping fails, return current time
      return Date.now();
    }
  }

  static async getIdToken(): Promise<string> {
    let authDetails = await getLocalAuthDetails();

    // If auth details not found, try user logging in
    if (!authDetails) await login();

    authDetails = await getLocalAuthDetails();
    if (!authDetails) throw new UserNotLoggedIn();

    return authDetails.id_token as string;
  }

  static async getDocument(documentId: string): Promise<Article> {
    const idToken = await this.getIdToken();

    const resp = await axios.get(`${DOCUMENT_ENDPOINT}/${documentId}`, {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });

    return resp.data as Article;
  }

  static async getPreviewJwt(siteId: string): Promise<string> {
    const idToken = await this.getIdToken();

    const resp = await axios.post(`${SITE_ENDPOINT}/${siteId}/preview`, null, {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });

    return resp.data.grantToken as string;
  }

  static async createApiKey(): Promise<string> {
    const idToken = await this.getIdToken();

    const resp = await axios.post(
      API_KEY_ENDPOINT,
      {},
      {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      },
    );
    return resp.data.apiKey as string;
  }

  static async listApiKeys(): Promise<ApiKey[]> {
    const idToken = await this.getIdToken();

    const resp = await axios.get(API_KEY_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });

    return resp.data as ApiKey[];
  }

  static async revokeApiKey(id: string): Promise<void> {
    const idToken = await this.getIdToken();

    try {
      await axios.delete(`${API_KEY_ENDPOINT}/${id}`, {
        headers: {
          Authorization: `Bearer ${idToken}`,
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
    const idToken = await this.getIdToken();

    const resp = await axios.post(
      SITE_ENDPOINT,
      { name: "", url, emailList: "" },
      {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      },
    );
    return resp.data.id as string;
  }

  static async listSites(): Promise<Site[]> {
    const idToken = await this.getIdToken();

    const resp = await axios.get(SITE_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });

    return resp.data as Site[];
  }
  static async getSite(siteId: string): Promise<Site> {
    const idToken = await this.getIdToken();

    const resp = await axios.get(`${SITE_ENDPOINT}/${siteId}`, {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });

    return resp.data as Site;
  }

  static async updateSite(id: string, url: string): Promise<void> {
    const idToken = await this.getIdToken();

    await axios.patch(
      `${SITE_ENDPOINT}/${id}`,
      { url },
      {
        headers: {
          Authorization: `Bearer ${idToken}`,
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
    const idToken = await this.getIdToken();

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
          Authorization: `Bearer ${idToken}`,
        },
      },
    );
  }

  static async fetchWebhookLogs(
    siteId: string,
    {
      limit,
      offset,
    }: {
      limit?: number;
      offset?: number;
    },
  ) {
    const idToken = await this.getIdToken();

    const resp = await axios.get(`${SITE_ENDPOINT}/${siteId}/webhookLogs`, {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
      params: {
        limit,
        offset,
      },
    });

    return resp.data as WebhookDeliveryLog[];
  }
}

export default AddOnApiHelper;
