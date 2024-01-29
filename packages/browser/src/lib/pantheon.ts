export type PantheonClientConfig = {
  pccHost?: string;
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
   * API Key for your PCC Workspace
   * @example
   * // If your API Key is ABC-DEF
   * const pantheonClient = new PantheonClient({
   *   siteId: '12345',
   *   apiKey: 'ABC-DEF',
   * });
   */
  apiKey: string;
};

export class PantheonClient {
  public host: string;
  public siteId: string;
  public apiKey: string;

  constructor(config: PantheonClientConfig) {
    // Allow the user to override the PCC host, but this would only be done
    // by the Pantheon team when testing staging or local dev backend environments.
    // It defaults to our production API endpoint. In a future release it will
    // be a more human-friendly URL.
    const pccHost =
      config.pccHost?.replace(/\/(?<=\/)\/*$/, "") ||
      "https://pcc-gfttxsojwq-uc.a.run.app";

    this.host = pccHost;
    this.siteId = config.siteId;
    this.apiKey = config.apiKey;

    if (!this.host) {
      throw new Error("Missing Pantheon Content Cloud host");
    }

    if (!this.siteId) {
      throw new Error("Missing Pantheon Content Cloud site ID");
    }

    if (!this.apiKey) {
      throw new Error("Missing Pantheon Content Cloud API Key");
    }
  }

  async query<TResult = unknown>(
    query: string,
    variables?: Record<string, any>,
  ) {
    return fetch(`${this.host}/sites/${this.siteId}/query`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "PCC-API-KEY": this.apiKey,
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.errors) {
          throw new Error(res.errors[0].message);
        }
        return res.data as TResult;
      });
  }
}
