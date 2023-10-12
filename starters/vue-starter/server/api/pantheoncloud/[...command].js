import { NuxtPantheonAPI } from "@pantheon-systems/pcc-vue-sdk/nuxt";
import { getPantheonClient, smartComponentMap } from "~/lib/pantheon";

export default NuxtPantheonAPI({
  getPantheonClient,
  resolvePath: (article) => `/articles/${article.slug || article.id}`,
  smartComponentMap: smartComponentMap,
});
