import { NormalizedCacheObject } from '@apollo/client';

import { ApolloClient, InMemoryCache } from '../lib/apollo-client';
import { DefaultLogger, Logger, NoopLogger } from '../utils/logger';

interface PantheonClientConfig {
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
   * URL of your Pantheon Content Cloud websocket host
   * @default pccHost
   * @example
   * // If your Pantheon Content Cloud instance is hosted at https://pantheon-content-cloud.com
   * // then your websocket host is wss://pantheon-content-cloud.com
   * const pantheonClient = new PantheonClient({
   *   pccHost: 'https://pantheon-content-cloud.com',
   *   pccWsHost: 'wss://pantheon-content-cloud.com',
   * });
   */
  pccWsHost?: string;

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
}

export class PantheonClient {
  public host: string;

  public wsHost: string;
  public siteId: string;
  public apiKey: string;

  public logger: Logger;
  private debug: boolean;

  public apolloClient: ApolloClient<NormalizedCacheObject>;

  constructor(config: PantheonClientConfig) {
    this.host = config.pccHost;
    this.wsHost =
      config.pccWsHost ||
      config.pccHost.replace(/^http/, 'ws').replace(/^https/, 'wss');
    this.siteId = config.siteId;
    this.apiKey = config.apiKey;

    this.debug = config.debug || false;
    this.logger = this.debug ? DefaultLogger : NoopLogger;

    if (!this.host) {
      throw new Error('Missing Pantheon Content Cloud host');
    }

    if (!this.siteId) {
      throw new Error('Missing Pantheon Content Cloud site ID');
    }

    if (!this.apiKey) {
      throw new Error('Missing Pantheon Content Cloud API Key');
    }

    this.apolloClient = new ApolloClient({
      uri: `${this.host}/sites/${this.siteId}/query`,
      cache: new InMemoryCache(),
      headers: {
        'PCC-API-KEY': this.apiKey,
      },
    });

    if (this.debug) {
      this.logger.info('PantheonClient initialized with config', config);
    }
  }
}
