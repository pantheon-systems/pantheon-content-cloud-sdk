export type {
  PantheonClientConfig,
  PantheonAPIOptions,
} from "@pantheon-systems/pcc-sdk-core";
export { PantheonClient } from "@pantheon-systems/pcc-sdk-core";

export {
  getArticles,
  getPaginatedArticles,
  getRecommendedArticles,
  getArticle,
  getAllTags,
  getArticleBySlugOrId,
  PCCConvenienceFunctions,
  updateConfig,
  GQL,
  getSite,
} from "@pantheon-systems/pcc-sdk-core";
export * from "@pantheon-systems/pcc-sdk-core/types";

export { NextPantheonAPI as PantheonAPI } from "../core/pantheon-api";
