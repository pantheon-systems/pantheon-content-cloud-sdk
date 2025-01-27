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
import { IncorrectAccount } from "../cli/exceptions";
import AddOnApiHelper from "./addonApiHelper";
import { getApiConfig } from "./apiConfig";
import * as LocalStorage from "./localStorage";

const DEFAULT_AUTH0_SCOPES = [
  "openid",
  "profile",
  "create:session",
  "offline_access",
];
const DEFAULT_GOOGLE_SCOPES = [
  "https://www.googleapis.com/auth/userinfo.email",
];

export interface PersistedTokens {
  id_token: string;
  refresh_token: string;
  access_token: string;
  scope: string;
  token_type: string;
}

abstract class BaseAuthProvider {
  protected scopes: string[] | undefined;
  protected email: string | undefined;
  constructor(scopes?: string[], email?: string) {
    this.scopes = scopes;
    this.email = email;
  }
  abstract generateToken(code: string): Promise<PersistedTokens>;
  abstract refreshToken(refreshToken: string): Promise<PersistedTokens>;
  abstract getTokens(): Promise<PersistedTokens | null>;
  abstract login(): Promise<void>;
}

export class Auth0Provider extends BaseAuthProvider {
  constructor(scopes?: string[], email?: string) {
    super();
    this.scopes = scopes || DEFAULT_AUTH0_SCOPES;
    this.email = email;
  }
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
    const apiConfig = await getApiConfig();
    const url = `${apiConfig.auth0Issuer}/oauth/token`;
    const response = await axios.post(url, {
      grant_type: "refresh_token",
      client_id: apiConfig.auth0ClientId,
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
              `You are already logged in as ${tokenPayload["pcc/email"]}.`,
            );
            return resolve();
          }

          const apiConfig = await getApiConfig();
          const authorizeUrl = `${apiConfig.auth0Issuer}/authorize?${queryString.stringify(
            {
              response_type: "code",
              client_id: apiConfig.auth0ClientId,
              redirect_uri: apiConfig.auth0RedirectUri,
              scope: DEFAULT_AUTH0_SCOPES.join(" "),
              audience: apiConfig.auth0Audience,
            },
          )}`;

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
                    email: tokenPayload["pcc/email"],
                  }),
                );
                server.destroy();

                spinner.succeed(
                  `You are successfully logged in as ${tokenPayload["pcc/email"]}`,
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
  constructor(scopes?: string[], email?: string) {
    super();
    this.scopes = scopes || DEFAULT_GOOGLE_SCOPES;
    this.email = email;
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

  async getTokens(): Promise<PersistedTokens | null> {
    const credentialArr = await LocalStorage.getGoogleAuthDetails();
    if (!credentialArr) return null;

    // Return null if required given email
    const credIndex = (credentialArr || []).findIndex((acc) => {
      const payload = parseJwt(acc.id_token as string);
      return payload.email === this.email;
    });
    if (credIndex === -1) return null;
    const credentials = credentialArr[credIndex];

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
      credentialArr[credIndex] = newCred;
      await LocalStorage.persistGoogleAuthDetails(credentialArr);
      return newCred;
    } catch (_err) {
      return null;
    }
  }

  login(): Promise<void> {
    return new Promise(
      // eslint-disable-next-line no-async-promise-executor -- Handling promise rejection in the executor
      async (resolve, reject) => {
        const spinner = ora("Connecting Google account...").start();
        try {
          const authData = await this.getTokens();
          if (authData) {
            const tokenPayload = parseJwt(authData.id_token as string);
            spinner.succeed(
              `"${tokenPayload.email}" Google account is already connected.`,
            );
            return resolve();
          }

          const apiConfig = await getApiConfig();
          const oAuth2Client = new OAuth2Client({
            clientId: apiConfig.googleClientId,
            redirectUri: apiConfig.googleRedirectUri,
          });

          // Generate the url that will be used for the consent dialog.
          const authorizeUrl = oAuth2Client.generateAuthUrl({
            access_type: "offline",
            scope: this.scopes,
          });

          const existingCredentials =
            (await LocalStorage.getGoogleAuthDetails()) || [];

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
                const content = readFileSync(
                  join(currDir, "../templates/accountConnectSuccess.html"),
                );
                const credentials = await this.generateToken(code as string);
                const tokenPayload = parseJwt(credentials.id_token as string);
                existingCredentials.push(credentials);
                await LocalStorage.persistGoogleAuthDetails(
                  existingCredentials,
                );

                res.end(
                  nunjucks.renderString(content.toString(), {
                    email: tokenPayload.email,
                  }),
                );
                server.destroy();
                if (this.email && this.email !== tokenPayload.email) {
                  throw new IncorrectAccount();
                }

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

export function getAuthProvider(
  authType: "auth0" | "google",
  scope?: string[],
  email?: string,
): Auth0Provider | GoogleAuthProvider {
  if (authType === "auth0") return new Auth0Provider(scope, email);
  else return new GoogleAuthProvider(scope, email);
}
