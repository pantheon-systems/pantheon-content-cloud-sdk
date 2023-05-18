import {
  ApolloClient,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client';

interface PantheonClientConfig {
  /**
   * URL of your Pantheon Content Cloud instance
   */
  pccHost: string;
}

export class PantheonClient {
  public host: string;

  public apolloClient: ApolloClient<NormalizedCacheObject>;

  constructor(config: PantheonClientConfig) {
    this.host = config.pccHost;

    if (!this.host) {
      throw new Error('Missing Pantheon Content Cloud host');
    }

    this.apolloClient = new ApolloClient({
      uri: `${this.host}/query`,
      cache: new InMemoryCache(),
    });
  }
}
