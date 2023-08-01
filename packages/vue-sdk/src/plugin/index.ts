import { DefaultApolloClient } from "@vue/apollo-composable";
import { PantheonClient, PantheonClientConfig } from "src/core/pantheon-client";
import type { App } from "vue";

export const plugin = {
  install: (app: App, options: PantheonClientConfig) => {
    const client = new PantheonClient(options);

    app.config.globalProperties.$pcc = options;
    app.config.globalProperties.$pcc.client = client;

    app.provide(DefaultApolloClient, client.apolloClient);
  },
};
