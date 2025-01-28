import { SmartComponentMapZod } from "@pantheon-systems/pcc-sdk-core/types";
import axios, { AxiosError, HttpStatusCode } from "axios";
import queryString from "query-string";
import { HTTPNotFound, UserNotLoggedIn } from "../cli/exceptions";
import { getApiConfig } from "./apiConfig";
import { Auth0Provider, GoogleAuthProvider, PersistedTokens } from "./auth";
import { toKebabCase } from "./utils";

class AddOnApiHelper {
  static async getCurrentTime(): Promise<number> {
    try {
      const resp = await axios.get(
        `${(await getApiConfig()).addOnApiEndpoint}/ping`,
      );
      return Number(resp.data.timestamp);
    } catch {
      // If ping fails, return current time
      return Date.now();
    }
  }

  static async getAuth0Tokens(): Promise<PersistedTokens> {
    const provider = new Auth0Provider();
    let tokens = await provider.getTokens();
    if (tokens) return tokens;

    // Login user if token is not found
    await provider.login();
    tokens = await provider.getTokens();
    if (tokens) return tokens;

    throw new UserNotLoggedIn();
  }
  static async getGoogleTokens(args?: {
    scopes?: string[];
    email?: string | undefined;
    domain?: string | undefined;
  }): Promise<PersistedTokens> {
    const { scopes, email, domain } = args || {};
    const provider = new GoogleAuthProvider(scopes, email, domain);
    let tokens = await provider.getTokens();
    if (tokens) return tokens;

    // Login user if token is not found
    await provider.login();
    tokens = await provider.getTokens();
    if (tokens) return tokens;

    throw new UserNotLoggedIn();
  }

  static async getDocument(
    documentId: string,
    insertIfMissing = false,
    domain: string,
    title?: string,
  ): Promise<Article> {
    const { access_token: auth0AccessToken } = await this.getAuth0Tokens();
    const { access_token: googleAccessToken } = await this.getGoogleTokens({
      domain,
    });

    const resp = await axios.get(
      `${(await getApiConfig()).DOCUMENT_ENDPOINT}/${documentId}`,
      {
        params: {
          insertIfMissing,
          ...(title && {
            withMetadata: { title, slug: toKebabCase(title) },
          }),
        },
        headers: {
          Authorization: `Bearer ${auth0AccessToken}`,
          "oauth-token": googleAccessToken,
        },
      },
    );

    return resp.data as Article;
  }

  static async addSiteMetadataField(
    siteId: string,
    contentType: string,
    fieldTitle: string,
    fieldType: string,
  ): Promise<void> {
    const { access_token: accessToken } = await this.getAuth0Tokens();

    await axios.post(
      `${(await getApiConfig()).SITE_ENDPOINT}/${siteId}/metadata`,
      {
        contentType,
        field: {
          title: fieldTitle,
          type: fieldType,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      },
    );
  }

  static async updateDocument(
    documentId: string,
    site: Site,
    title: string,
    tags: string[],
    metadataFields: {
      [key: string]: string | number | boolean | undefined | null;
    } | null,

    verbose?: boolean,
  ): Promise<Article> {
    const { access_token: auth0AccessToken } = await this.getAuth0Tokens();
    const { access_token: googleAccessToken } = await this.getGoogleTokens({
      domain: site.domain,
    });

    if (verbose) {
      console.log("update document", {
        documentId,
        siteId: site.id,
        title,
        tags,
        metadataFields,
      });
    }

    const resp = await axios.patch(
      `${(await getApiConfig()).DOCUMENT_ENDPOINT}/${documentId}`,
      {
        siteId: site.id,
        tags,
        title,
        ...(metadataFields && {
          metadataFields,
        }),
      },
      {
        headers: {
          Authorization: `Bearer ${auth0AccessToken}`,
          "oauth-token": googleAccessToken,
          "Content-Type": "application/json",
        },
      },
    );

    return resp.data as Article;
  }

  static async publishDocument(documentId: string, domain: string) {
    const { id_token: idToken, access_token: oauthToken } =
      await this.getGoogleTokens({
        scopes: ["https://www.googleapis.com/auth/drive.file"],
        domain,
      });

    if (!idToken || !oauthToken) {
      throw new UserNotLoggedIn();
    }

    const resp = await axios.post<{ url: string }>(
      `${(await getApiConfig()).DOCUMENT_ENDPOINT}/${documentId}/publish`,
      {},
      {
        headers: {
          Authorization: `Bearer ${idToken}`,
          "Content-Type": "application/json",
          "oauth-token": oauthToken,
        },
      },
    );

    const publishUrl = resp.data.url;

    try {
      const resp = await axios.get(publishUrl);

      // Get the published URL
      console.log("Published to ", resp.request.res.responseUrl);
    } catch (e) {
      if (e instanceof AxiosError) console.error(e, e.code, e.message);
      throw e;
    }
  }

  static async previewFile(
    docId: string,
    domain: string,
    {
      baseUrl,
    }: {
      baseUrl?: string;
    },
  ): Promise<string> {
    const { access_token: auth0AccessToken } = await this.getAuth0Tokens();
    const { access_token: googleAccessToken } = await this.getGoogleTokens({
      scopes: ["https://www.googleapis.com/auth/drive"],
      domain,
    });

    const resp = await axios.post<{ url: string }>(
      `${(await getApiConfig()).DOCUMENT_ENDPOINT}/${docId}/preview`,
      {
        baseUrl,
      },
      {
        headers: {
          Authorization: `Bearer ${auth0AccessToken}`,
          "Content-Type": "application/json",
          "oauth-token": googleAccessToken,
        },
      },
    );

    const previewURL = resp.data.url;

    return previewURL;
  }

  static async createApiKey({
    siteId,
  }: { siteId?: string } = {}): Promise<string> {
    const { access_token: accessToken } = await this.getAuth0Tokens();

    const resp = await axios.post(
      (await getApiConfig()).API_KEY_ENDPOINT,
      {
        siteId,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return resp.data.apiKey as string;
  }

  static async listApiKeys(): Promise<ApiKey[]> {
    const { access_token: accessToken } = await this.getAuth0Tokens();

    const resp = await axios.get((await getApiConfig()).API_KEY_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return resp.data as ApiKey[];
  }

  static async revokeApiKey(id: string): Promise<void> {
    const { access_token: accessToken } = await this.getAuth0Tokens();

    try {
      await axios.delete(`${(await getApiConfig()).API_KEY_ENDPOINT}/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
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

  static async createSite(url: string, domain: string): Promise<string> {
    const { access_token: googleAccessToken } = await this.getGoogleTokens({
      domain,
    });
    const { access_token: auth0AccessToken } = await this.getAuth0Tokens();

    const resp = await axios.post(
      (await getApiConfig()).SITE_ENDPOINT,
      { name: "", url, emailList: "" },
      {
        headers: {
          Authorization: `Bearer ${auth0AccessToken}`,
          "oauth-token": googleAccessToken,
        },
      },
    );
    return resp.data.id as string;
  }

  static async deleteSite(
    id: string,
    transferToSiteId: string | null | undefined,
    force: boolean,
  ): Promise<string> {
    const { access_token: accessToken } = await this.getAuth0Tokens();

    const resp = await axios.delete(
      queryString.stringifyUrl({
        url: `${(await getApiConfig()).SITE_ENDPOINT}/${id}`,
        query: {
          transferToSiteId,
          force,
        },
      }),
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return resp.data.id as string;
  }

  static async listSites({
    withConnectionStatus,
  }: {
    withConnectionStatus?: boolean;
  }): Promise<Site[]> {
    const { access_token: accessToken } = await this.getAuth0Tokens();

    const resp = await axios.get((await getApiConfig()).SITE_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        withConnectionStatus,
      },
    });

    return resp.data as Site[];
  }

  static async getSite(siteId: string): Promise<Site> {
    const { access_token: accessToken } = await this.getAuth0Tokens();

    const resp = await axios.get(
      `${(await getApiConfig()).SITE_ENDPOINT}/${siteId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    return resp.data as Site;
  }

  static async updateSite(id: string, url: string): Promise<void> {
    const { access_token: accessToken } = await this.getAuth0Tokens();

    await axios.patch(
      `${(await getApiConfig()).SITE_ENDPOINT}/${id}`,
      { url },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
  }

  static async getServersideComponentSchema(id: string): Promise<void> {
    const { access_token: accessToken } = await this.getAuth0Tokens();

    await axios.get(
      `${(await getApiConfig()).SITE_ENDPOINT}/${id}/components`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
  }

  static async pushComponentSchema(
    id: string,
    componentSchema: typeof SmartComponentMapZod,
  ): Promise<void> {
    const { access_token: accessToken } = await this.getAuth0Tokens();

    await axios.post(
      `${(await getApiConfig()).SITE_ENDPOINT}/${id}/components`,
      {
        componentSchema,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
  }

  static async removeComponentSchema(id: string): Promise<void> {
    const { access_token: accessToken } = await this.getAuth0Tokens();

    await axios.delete(
      `${(await getApiConfig()).SITE_ENDPOINT}/${id}/components`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
  }

  static async listAdmins(id: string): Promise<void> {
    const { access_token: accessToken } = await this.getAuth0Tokens();

    return (
      await axios.get(`${(await getApiConfig()).SITE_ENDPOINT}/${id}/admins`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
    ).data;
  }

  static async addAdmin(id: string, email: string): Promise<void> {
    const { access_token: accessToken } = await this.getAuth0Tokens();

    await axios.patch(
      `${(await getApiConfig()).SITE_ENDPOINT}/${id}/admins`,
      {
        email,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
  }

  static async removeAdmin(id: string, email: string): Promise<void> {
    const { access_token: accessToken } = await this.getAuth0Tokens();

    await axios.delete(`${(await getApiConfig()).SITE_ENDPOINT}/${id}/admins`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      data: {
        email,
      },
    });
  }

  static async listCollaborators(id: string): Promise<void> {
    const { access_token: accessToken } = await this.getAuth0Tokens();

    return (
      await axios.get(
        `${(await getApiConfig()).SITE_ENDPOINT}/${id}/collaborators`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      )
    ).data;
  }

  static async addCollaborator(id: string, email: string): Promise<void> {
    const { access_token: accessToken } = await this.getAuth0Tokens();

    await axios.patch(
      `${(await getApiConfig()).SITE_ENDPOINT}/${id}/collaborators`,
      {
        email,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
  }

  static async removeCollaborator(id: string, email: string): Promise<void> {
    const { access_token: accessToken } = await this.getAuth0Tokens();

    await axios.delete(
      `${(await getApiConfig()).SITE_ENDPOINT}/${id}/collaborators`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        data: {
          email,
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
      preferredEvents,
    }: {
      url?: string;
      webhookUrl?: string;
      webhookSecret?: string;
      preferredEvents?: string[];
    },
  ): Promise<void> {
    const { access_token: accessToken } = await this.getAuth0Tokens();

    const configuredWebhook = webhookUrl || webhookSecret || preferredEvents;

    await axios.patch(
      `${(await getApiConfig()).SITE_ENDPOINT}/${id}`,
      {
        ...(url && { url: url }),
        ...(configuredWebhook && {
          webhookConfig: {
            ...(webhookUrl && { webhookUrl: webhookUrl }),
            ...(webhookSecret && { webhookSecret: webhookSecret }),
            ...(preferredEvents && { preferredEvents }),
          },
        }),
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
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
    const { access_token: accessToken } = await this.getAuth0Tokens();

    const resp = await axios.get(
      `${(await getApiConfig()).SITE_ENDPOINT}/${siteId}/webhookLogs`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          limit,
          offset,
        },
      },
    );

    return resp.data as WebhookDeliveryLog[];
  }

  static async fetchAvailableWebhookEvents(siteId: string) {
    const { access_token: accessToken } = await this.getAuth0Tokens();

    const resp = await axios.get(
      `${(await getApiConfig()).SITE_ENDPOINT}/${siteId}/availableWebhookEvents`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    return resp.data as string[];
  }
}

export default AddOnApiHelper;
