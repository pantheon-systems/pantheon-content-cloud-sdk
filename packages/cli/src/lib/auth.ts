import { readFileSync } from "fs";
import http from "http";
import { dirname, join } from "path";
import url, { fileURLToPath } from "url";
import { parseJwt } from "@pantheon-systems/pcc-sdk-core";
import axios from "axios";
import { OAuth2Client } from "google-auth-library";
import nunjucks from "nunjucks";
import open from "open";
import ora from "ora";
import queryString from "query-string";
import destroyer from "server-destroy";
import AddOnApiHelper from "./addonApiHelper";
import { getApiConfig } from "./apiConfig";
import * as LocalStorage from "./localStorage";

export const AUTH0_PCC_CONTEXT_KEY = "pcc";
const DEFAULT_AUTH0_SCOPES = ["openid", "profile", "offline_access"];
const DEFAULT_AUTH0_API_SCOPES = ["create:session"];

const DEFAULT_GOOGLE_SCOPES = [
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
];

export interface PersistedTokens {
  id_token: string;
  refresh_token: string;
  access_token: string;
  scope: string;
  token_type: string;
}

abstract class BaseAuthProvider {
  abstract generateToken(code: string): Promise<PersistedTokens>;
  abstract refreshToken(refreshToken: string): Promise<PersistedTokens>;
  abstract getTokens(email?: string): Promise<PersistedTokens | null>;
  abstract login(email?: string): Promise<void>;
}

export class Auth0Provider extends BaseAuthProvider {
  async generateToken(code: string): Promise<PersistedTokens> {
    const resp = await axios.post(
      `${(await getApiConfig()).AUTH0_ENDPOINT}/token`,
      {
        code: code,
      },
    );
    return resp.data as PersistedTokens;
  }

  async refreshToken(refreshToken: string): Promise<PersistedTokens> {
    const auth0Config = await AddOnApiHelper.getAuth0Config();
    const url = `${auth0Config.issuerBaseUrl}/oauth/token`;
    const response = await axios.post(url, {
      grant_type: "refresh_token",
      client_id: auth0Config.clientId,
      refresh_token: refreshToken,
    });
    return {
      refresh_token: refreshToken,
      ...response.data,
    } as PersistedTokens;
  }

  async getTokens(): Promise<PersistedTokens | null> {
    const credentials = await LocalStorage.getAuthDetails();
    if (!credentials) return null;

    // Return null if required scope is not present
    const grantedScopes = new Set(credentials.scope?.split(" ") || []);
    if (!DEFAULT_AUTH0_SCOPES.every((i) => grantedScopes.has(i))) {
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
      const newCred = await this.refreshToken(
        credentials.refresh_token as string,
      );
      await LocalStorage.persistAuthDetails(newCred);
      return newCred;
    } catch (_err) {
      return null;
    }
  }

  async login(): Promise<void> {
    return new Promise(
      // eslint-disable-next-line no-async-promise-executor -- Handling promise rejection in the executor
      async (resolve, reject) => {
        const spinner = ora("Logging you in...").start();
        try {
          const authData = await this.getTokens();
          if (authData) {
            const tokenPayload = parseJwt(authData.access_token as string);
            spinner.succeed(
              `You are already logged in as ${tokenPayload[AUTH0_PCC_CONTEXT_KEY].email}.`,
            );
            return resolve();
          }

          const auth0Config = await AddOnApiHelper.getAuth0Config();
          const authorizeUrl = `${auth0Config.issuerBaseUrl}/authorize?${queryString.stringify(
            {
              response_type: "code",
              client_id: auth0Config.clientId,
              redirect_uri: auth0Config.redirectUri,
              scope: [
                ...DEFAULT_AUTH0_SCOPES,
                ...DEFAULT_AUTH0_API_SCOPES,
              ].join(" "),
              audience: auth0Config.audience,
            },
          )}`;

          const server = http.createServer(async (req, res) => {
            try {
              if (!req.url) {
                throw new Error("No URL path provided");
              }

              if (req.url.indexOf("/auth/callback") > -1) {
                const qs = new url.URL(req.url, "http://localhost:3030")
                  .searchParams;
                const code = qs.get("code");
                const currDir = dirname(fileURLToPath(import.meta.url));
                const content = readFileSync(
                  join(currDir, "../templates/loginSuccess.html"),
                );
                const credentials = await this.generateToken(code as string);
                const tokenPayload = parseJwt(
                  credentials.access_token as string,
                );
                await LocalStorage.persistAuthDetails(credentials);

                res.end(
                  nunjucks.renderString(content.toString(), {
                    email: tokenPayload[AUTH0_PCC_CONTEXT_KEY].email,
                  }),
                );
                server.destroy();

                spinner.succeed(
                  `You are successfully logged in as ${tokenPayload[AUTH0_PCC_CONTEXT_KEY].email}`,
                );
                resolve();
              }
            } catch (e) {
              spinner.fail();
              reject(e);
            }
          });

          destroyer(server);

          server.listen(3030, () => {
            open(authorizeUrl, { wait: true }).then((cp) => cp.kill());
          });
        } catch (e) {
          spinner.fail();
          reject(e);
        }
      },
    );
  }
}

export class GoogleAuthProvider extends BaseAuthProvider {
  private scopes?: string[];
  constructor(scopes?: string[]) {
    super();
    this.scopes = [...DEFAULT_GOOGLE_SCOPES, ...(scopes || [])];
  }
  async generateToken(code: string): Promise<PersistedTokens> {
    const resp = await axios.post(
      `${(await getApiConfig()).OAUTH_ENDPOINT}/token`,
      {
        code: code,
      },
    );
    return resp.data as PersistedTokens;
  }

  async refreshToken(refreshToken: string): Promise<PersistedTokens> {
    const resp = await axios.post(
      `${(await getApiConfig()).OAUTH_ENDPOINT}/refresh`,
      {
        refreshToken,
      },
    );
    return resp.data as PersistedTokens;
  }

  async getTokens(email: string): Promise<PersistedTokens | null> {
    const credentials = await LocalStorage.getGoogleAuthDetails(email);
    if (!credentials) return null;

    // Return null if required scope is not present
    const grantedScopes = new Set(credentials.scope?.split(" ") || []);
    if (
      this.scopes &&
      this.scopes.length > 0 &&
      !this.scopes.every((i) => grantedScopes.has(i))
    ) {
      return null;
    }

    const tokenPayload = parseJwt(credentials.id_token as string);
    // Check if token is expired
    if (tokenPayload.exp) {
      const currentTime = await AddOnApiHelper.getCurrentTime();

      if (currentTime < tokenPayload.exp * 1000) {
        return credentials;
      }
    }

    try {
      const newCred = await this.refreshToken(
        credentials.refresh_token as string,
      );
      await LocalStorage.persistGoogleAuthDetails(email, newCred);
      return newCred;
    } catch (_err) {
      return null;
    }
  }

  login(email?: string): Promise<void> {
    return new Promise(
      // eslint-disable-next-line no-async-promise-executor -- Handling promise rejection in the executor
      async (resolve, reject) => {
        const message = email
          ? `Requesting access to ${email} account...`
          : "Connecting Google account...";
        const templateName = email
          ? "../templates/accountAccessGranted.html"
          : "../templates/accountConnectSuccess.html";
        const spinner = ora(message).start();
        try {
          const apiConfig = await getApiConfig();
          const oAuth2Client = new OAuth2Client({
            clientId: apiConfig.googleClientId,
            redirectUri: apiConfig.googleRedirectUri,
          });

          // Generate the url that will be used for the consent dialog.
          const authorizeUrl = oAuth2Client.generateAuthUrl({
            access_type: "offline",
            prompt: "consent",
            scope: this.scopes,
            ...(email && { login_hint: email }),
          });

          const server = http.createServer(async (req, res) => {
            try {
              if (!req.url) {
                throw new Error("No URL path provided");
              }

              if (req.url.indexOf("/oauth-redirect") > -1) {
                const qs = new url.URL(req.url, "http://localhost:3030")
                  .searchParams;
                const code = qs.get("code");
                const currDir = dirname(fileURLToPath(import.meta.url));
                const content = readFileSync(join(currDir, templateName));
                const credentials = await this.generateToken(code as string);

                try {
                  await AddOnApiHelper.connectAccount(credentials.access_token);
                } catch (e) {
                  if (
                    (e as { response: { data: { message: string } } }).response
                      ?.data.message ===
                    "account_already_connected_to_other_user"
                  ) {
                    spinner.fail(
                      "You cannot connect this account because it’s already linked to another Pantheon user.",
                    );
                    resolve();
                    return;
                  } else if (
                    (e as { response: { data: { message: string } } }).response
                      ?.data.message === "cannot_connect_gmail_account"
                  ) {
                    spinner.fail(
                      "Only Google Workspace accounts are supported. Please connect your work email.",
                    );
                    resolve();
                    return;
                  }
                }

                const tokenPayload = parseJwt(credentials.id_token as string);
                await LocalStorage.persistGoogleAuthDetails(
                  tokenPayload.email,
                  credentials,
                );

                res.end(
                  nunjucks.renderString(content.toString(), {
                    email: tokenPayload.email,
                  }),
                );
                server.destroy();

                spinner.succeed(
                  `Successfully connected "${tokenPayload.email}" Google account.`,
                );
                resolve();
              }
            } catch (e) {
              spinner.fail();
              reject(e);
            }
          });

          destroyer(server);

          server.listen(3030, () => {
            open(authorizeUrl, { wait: true }).then((cp) => cp.kill());
          });
        } catch (e) {
          spinner.fail();
          reject(e);
        }
      },
    );
  }
}
