import {
  NormalizedCacheObject,
  ApolloClient,
  InMemoryCache,
} from "@apollo/client";

import { DefaultLogger, Logger, NoopLogger } from "../utils/logger";

export interface PantheonClientConfig {
  /**
   * API Key for your PCC Workspace
   * @example
   * // If your API Key is ABC-DEF
   * const pantheonClient = new PantheonClient({
   *   pccHost: 'https://pantheon-content-cloud.com',
   *   siteId: '12345',
   *   apiKey: 'ABC-DEF',
   * });
   */
  apiKey: string;

  debug?: boolean;

  /**
   * URL of your Pantheon Content Cloud instance
   * @example
   * // If your Pantheon Content Cloud instance is hosted at https://pantheon-content-cloud.com
   * // then your host is https://pantheon-content-cloud.com
   * const pantheonClient = new PantheonClient({
   * pccHost: 'https://pantheon-content-cloud.com',
   * });
   */
  pccHost: string;

  /**
   * ID of the site you want to query
   * @example
   * // If your site ID is 12345
   * const pantheonClient = new PantheonClient({
   *   pccHost: 'https://pantheon-content-cloud.com',
   *   siteId: '12345',
   *   apiKey: 'ABC-DEF',
   * });
   */
  siteId: string;
}

export class PantheonClient {
  public host: string;
  public siteId: string;
  public apiKey: string;
  public logger: Logger;
  public apolloClient: ApolloClient<NormalizedCacheObject>;

  public wsHost: string;
  private debug: boolean;

  constructor(config: PantheonClientConfig) {
    this.host = config.pccHost.replace(/\/$/, "");
    this.wsHost = config.pccHost
      .replace(/^http/, "ws")
      .replace(/^https/, "wss");
    this.siteId = config.siteId;
    this.apiKey = config.apiKey;

    this.debug = config.debug || false;
    this.logger = this.debug ? DefaultLogger : NoopLogger;

    if (!this.host) {
      throw new Error("Missing Pantheon Content Cloud host");
    }

    if (!this.siteId) {
      throw new Error("Missing Pantheon Content Cloud site ID");
    }

    if (!this.apiKey) {
      throw new Error("Missing Pantheon Content Cloud API Key");
    }

    this.apolloClient = new ApolloClient({
      uri: `${this.host}/sites/${this.siteId}/query`,
      cache: new InMemoryCache(),
    });

    if (this.debug) {
      this.logger.info("PantheonClient initialized with config", config);
    }
  }
}
