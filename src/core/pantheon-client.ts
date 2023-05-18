import {
  ApolloClient,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client';

interface PantheonClientConfig {
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
   *  pccHost: 'https://pantheon-content-cloud.com',
   * pccWsHost: 'wss://pantheon-content-cloud.com',
   * });
   */

  pccWsHost?: string;
}

export class PantheonClient {
  public host: string;
  public wsHost: string;

  public apolloClient: ApolloClient<NormalizedCacheObject>;

  constructor(config: PantheonClientConfig) {
    this.host = config.pccHost;
    this.wsHost =
      config.pccWsHost ||
      config.pccHost.replace(/^http/, 'ws').replace(/^https/, 'wss');

    if (!this.host) {
      throw new Error('Missing Pantheon Content Cloud host');
    }

    this.apolloClient = new ApolloClient({
      uri: `${this.host}/query`,
      cache: new InMemoryCache(),
    });
  }
}
