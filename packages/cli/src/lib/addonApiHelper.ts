import { SmartComponentMapZod } from "@pantheon-systems/pcc-sdk-core/types";
import axios, { AxiosError, HttpStatusCode } from "axios";
import { Credentials } from "google-auth-library";
import ora from "ora";
import queryString from "query-string";
import login, { loginOAuth } from "../cli/commands/login";
import { HTTPNotFound, UserNotLoggedIn } from "../cli/exceptions";
import { getApiConfig } from "./apiConfig";
import {
  CREDENTIAL_TYPE,
  getLocalAuthDetails,
  NextJwtCredentials,
} from "./localStorage";
import { toKebabCase } from "./utils";

class AddOnApiHelper {
  static async getToken(code: string): Promise<Credentials> {
    const resp = await axios.post(
      `${(await getApiConfig()).OAUTH_ENDPOINT}/token`,
      {
        code: code,
      },
    );
    return resp.data as Credentials;
  }
  static async refreshToken(refreshToken: string): Promise<Credentials> {
    const resp = await axios.post(
      `${(await getApiConfig()).OAUTH_ENDPOINT}/refresh`,
      {
        refreshToken,
      },
    );
    return resp.data as Credentials;
  }

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

  static async getNextJwt(): Promise<string> {
    let authDetails = (await getLocalAuthDetails(
      CREDENTIAL_TYPE.NEXT_JWT,
    )) as NextJwtCredentials | null;

    // If auth details not found, try user logging in
    if (!authDetails) {
      const prevOra = ora().stopAndPersist();
      await login();
      prevOra.start();
      authDetails = (await getLocalAuthDetails(
        CREDENTIAL_TYPE.NEXT_JWT,
      )) as NextJwtCredentials | null;
      if (!authDetails) throw new UserNotLoggedIn();
    }

    return authDetails?.token;
  }

  static async getIdToken(
    requiredScopes?: string[],
    withAuthToken?: true,
  ): Promise<{ idToken: string; oauthToken: string }>;
  static async getIdToken(requiredScopes?: string[], withAuthToken?: boolean) {
    let authDetails = (await getLocalAuthDetails(
      CREDENTIAL_TYPE.OAUTH,
      requiredScopes,
    )) as Credentials | null;

    // If auth details not found, try user logging in
    if (!authDetails) {
      const prevOra = ora().stopAndPersist();
      await loginOAuth(requiredScopes || []);
      prevOra.start();
      authDetails = (await getLocalAuthDetails(
        CREDENTIAL_TYPE.OAUTH,
        requiredScopes,
      )) as Credentials | null;
      if (!authDetails) throw new UserNotLoggedIn();
    }

    return withAuthToken
      ? { idToken: authDetails.id_token, oauthToken: authDetails.access_token }
      : authDetails.id_token;
  }

  static async getDocument(
    documentId: string,
    insertIfMissing = false,
    title?: string,
  ): Promise<Article> {
    const idToken = await this.getIdToken();

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
          Authorization: `Bearer ${idToken}`,
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
    const jwtToken = await this.getNextJwt();

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
          Authorization: `Bearer ${jwtToken}`,
          "Content-Type": "application/json",
        },
      },
    );
  }

  static async updateDocument(
    documentId: string,
    siteId: string,
    title: string,
    tags: string[],
    metadataFields: {
      [key: string]: string | number | boolean | undefined | null;
    } | null,

    verbose?: boolean,
  ): Promise<Article> {
    const idToken = await this.getIdToken();

    if (verbose) {
      console.log("update document", {
        documentId,
        siteId,
        title,
        tags,
        metadataFields,
      });
    }

    const resp = await axios.patch(
      `${(await getApiConfig()).DOCUMENT_ENDPOINT}/${documentId}`,
      {
        siteId,
        tags,
        title,
        ...(metadataFields && {
          metadataFields,
        }),
      },
      {
        headers: {
          Authorization: `Bearer ${idToken}`,
          "Content-Type": "application/json",
        },
      },
    );

    return resp.data as Article;
  }

  static async publishDocument(documentId: string) {
    const { idToken, oauthToken } = await this.getIdToken(
      ["https://www.googleapis.com/auth/drive"],
      true,
    );

    if (!idToken || !oauthToken) {
      throw new UserNotLoggedIn();
    }

    const resp = await axios.post<{ url: string }>(
      `${(await getApiConfig()).DOCUMENT_ENDPOINT}/${documentId}/publish`,
      null,
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
    {
      baseUrl,
    }: {
      baseUrl?: string;
    },
  ): Promise<string> {
    const { idToken, oauthToken } = await this.getIdToken(
      ["https://www.googleapis.com/auth/drive"],
      true,
    );

    if (!idToken || !oauthToken) {
      throw new UserNotLoggedIn();
    }

    const resp = await axios.post<{ url: string }>(
      `${(await getApiConfig()).DOCUMENT_ENDPOINT}/${docId}/preview`,
      {
        baseUrl,
      },
      {
        headers: {
          Authorization: `Bearer ${idToken}`,
          "Content-Type": "application/json",
          "oauth-token": oauthToken,
        },
      },
    );

    const previewURL = resp.data.url;

    return previewURL;
  }

  static async createApiKey({
    siteId,
  }: { siteId?: string } = {}): Promise<string> {
    const jwtToken = await this.getNextJwt();

    const resp = await axios.post(
      (await getApiConfig()).API_KEY_ENDPOINT,
      {
        siteId,
      },
      {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      },
    );
    return resp.data.apiKey as string;
  }

  static async listApiKeys(): Promise<ApiKey[]> {
    const jwtToken = await this.getNextJwt();

    const resp = await axios.get((await getApiConfig()).API_KEY_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    return resp.data as ApiKey[];
  }

  static async revokeApiKey(id: string): Promise<void> {
    const jwtToken = await this.getNextJwt();

    try {
      await axios.delete(`${(await getApiConfig()).API_KEY_ENDPOINT}/${id}`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
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
    const jwtToken = await this.getNextJwt();

    const resp = await axios.post(
      (await getApiConfig()).SITE_ENDPOINT,
      { name: "", url, emailList: "" },
      {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
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
    const jwtToken = await this.getNextJwt();

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
          Authorization: `Bearer ${jwtToken}`,
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
    const jwtToken = await this.getNextJwt();

    const resp = await axios.get((await getApiConfig()).SITE_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      params: {
        withConnectionStatus,
      },
    });

    return resp.data as Site[];
  }

  static async getSite(siteId: string): Promise<Site> {
    const idToken = await this.getIdToken();

    const resp = await axios.get(
      `${(await getApiConfig()).SITE_ENDPOINT}/${siteId}`,
      {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      },
    );

    return resp.data as Site;
  }

  static async updateSite(id: string, url: string): Promise<void> {
    const jwtToken = await this.getNextJwt();

    await axios.patch(
      `${(await getApiConfig()).SITE_ENDPOINT}/${id}`,
      { url },
      {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      },
    );
  }

  static async getServersideComponentSchema(id: string): Promise<void> {
    const jwtToken = await this.getNextJwt();

    await axios.get(
      `${(await getApiConfig()).SITE_ENDPOINT}/${id}/components`,
      {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      },
    );
  }

  static async pushComponentSchema(
    id: string,
    componentSchema: typeof SmartComponentMapZod,
  ): Promise<void> {
    const jwtToken = await this.getNextJwt();

    await axios.post(
      `${(await getApiConfig()).SITE_ENDPOINT}/${id}/components`,
      {
        componentSchema,
      },
      {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      },
    );
  }

  static async removeComponentSchema(id: string): Promise<void> {
    const jwtToken = await this.getNextJwt();

    await axios.delete(
      `${(await getApiConfig()).SITE_ENDPOINT}/${id}/components`,
      {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      },
    );
  }

  static async listAdmins(id: string): Promise<void> {
    const jwtToken = await this.getNextJwt();

    return (
      await axios.get(`${(await getApiConfig()).SITE_ENDPOINT}/${id}/admins`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      })
    ).data;
  }

  static async addAdmin(id: string, email: string): Promise<void> {
    const jwtToken = await this.getNextJwt();

    await axios.patch(
      `${(await getApiConfig()).SITE_ENDPOINT}/${id}/admins`,
      {
        email,
      },
      {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      },
    );
  }

  static async removeAdmin(id: string, email: string): Promise<void> {
    const jwtToken = await this.getNextJwt();

    await axios.delete(`${(await getApiConfig()).SITE_ENDPOINT}/${id}/admins`, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      data: {
        email,
      },
    });
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
    const jwtToken = await this.getNextJwt();

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
          Authorization: `Bearer ${jwtToken}`,
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
    const jwtToken = await this.getNextJwt();

    const resp = await axios.get(
      `${(await getApiConfig()).SITE_ENDPOINT}/${siteId}/webhookLogs`,
      {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
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
    const jwtToken = await this.getNextJwt();

    const resp = await axios.get(
      `${(await getApiConfig()).SITE_ENDPOINT}/${siteId}/availableWebhookEvents`,
      {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      },
    );

    return resp.data as string[];
  }
}

export default AddOnApiHelper;
