export type { PantheonClientConfig } from "@pantheon-systems/pcc-sdk-core";

export {
  getArticles,
  getRecommendedArticles,
  getArticle,
  getAllTags,
} from "@pantheon-systems/pcc-sdk-core";
export * from "@pantheon-systems/pcc-sdk-core";

export { plugin as pccPlugin } from "./plugin";

export * from "./hooks";
