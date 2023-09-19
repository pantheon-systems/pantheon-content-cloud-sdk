import type { NormalizedCacheObject } from "@apollo/client";
import { createClient } from "graphql-ws";
import {
  ApolloClient,
  getMainDefinition,
  GraphQLWsLink,
  HttpLink,
  InMemoryCache,
  split,
} from "../lib/apollo-client";
import { DefaultLogger, Logger, NoopLogger } from "../lib/logger";

export interface PantheonClientConfig {
  /**
   * API Key for your PCC Workspace
   * @example
   * // If your API Key is ABC-DEF
   * const pantheonClient = new PantheonClient({
   *   siteId: '12345',
   *   apiKey: 'ABC-DEF',
   * });
   */
  apiKey: string;

  debug?: boolean;

  /**
   * NOT FOR EXTERNAL USE.
   */
  pccHost: string;

  /**
   * ID of the site you want to query
   * @example
   * // If your site ID is 12345
   * const pantheonClient = new PantheonClient({
   *   siteId: '12345',
   *   apiKey: 'ABC-DEF',
   * });
   */
  siteId: string;

  /**
   * Optional parameter to provide a PCC Grant in place of an API Key.
   * Useful for preventing preview content from being viewed publicly.
   * Any preview links generated from the add-on will include a PCC Grant.
   * Provide it here to ensure that only users with the preview link can view the content.
   *
   * @example
   * const pantheonClient = new PantheonClient({
   *  siteId: '12345',
   *  pccGrant: 'pcc_grant ABC-DEF',
   * });
   */
  pccGrant?: string;
}

export class PantheonClient {
  public host: string;
  public siteId: string;
  public apiKey: string | undefined;
  public logger: Logger;
  public apolloClient: ApolloClient<NormalizedCacheObject>;

  private debug: boolean;
  private wsHost: string;

  constructor(config: PantheonClientConfig) {
    // Allow the user to override the PCC host, but this would only be done
    // by the Pantheon team when testing staging or local dev backend environments.
    // It defaults to our production API endpoint. In a future release it will
    // be a more human-friendly URL.
    const pccHost = config.pccHost || "https://pcc-gfttxsojwq-uc.a.run.app";

    this.host = pccHost.replace(/\/$/, "");
    this.wsHost = pccHost.replace(/^http/, "ws").replace(/^https/, "wss");
    this.siteId = config.siteId;
    this.debug = !!config.debug;
    this.logger = this.debug ? DefaultLogger : NoopLogger;

    this.apiKey = undefined;
    if (config.pccGrant) {
      if (config.pccGrant.includes("pcc_grant ")) {
        this.apiKey = config.pccGrant;
      } else {
        this.apiKey = `pcc_grant ${config.pccGrant}`;
      }

      console.log(this.apiKey);
    } else if (config.apiKey) {
      this.apiKey = config.apiKey;
    }

    if (!this.host) {
      throw new Error("Missing Pantheon Content Cloud host");
    }

    if (!this.siteId) {
      throw new Error("Missing Pantheon Content Cloud site ID");
    }

    if (!this.apiKey) {
      throw new Error("Missing Pantheon Content Cloud API Key");
    }

    const wsLink =
      typeof window !== "undefined"
        ? new GraphQLWsLink(
            createClient({
              url: `${this.wsHost}/sites/${this.siteId}/query`,
              connectionParams: {
                "PCC-API-KEY": this.apiKey,
              },
            }),
          )
        : undefined;

    const httpLink = new HttpLink({
      uri: `${this.host}/sites/${this.siteId}/query`,
      headers: {
        "PCC-API-KEY": this.apiKey,
      },
    });

    const splitLink =
      typeof window !== "undefined" && wsLink
        ? split(
            ({ query }) => {
              const definition = getMainDefinition(query);
              return (
                definition.kind === "OperationDefinition" &&
                definition.operation === "subscription"
              );
            },
            wsLink,
            httpLink,
          )
        : httpLink;

    this.apolloClient = new ApolloClient({
      link: splitLink,
      cache: new InMemoryCache(),
    });

    if (this.debug) {
      this.logger.info("PantheonClient initialized with config", config);
    }
  }
}
