export type {
  PantheonClientConfig,
  PantheonAPIOptions,
} from "@pantheon-systems/pcc-sdk-core";
export { PantheonClient } from "@pantheon-systems/pcc-sdk-core";

export {
  getArticles,
  getPaginatedArticles,
  getArticle,
  getAllTags,
  getArticleBySlugOrId,
  PCCConvenienceFunctions,
} from "@pantheon-systems/pcc-sdk-core";
export * from "@pantheon-systems/pcc-sdk-core/types";

export * from "./core/pantheon-context";

export { NextPantheonAPI as PantheonAPI } from "./core/pantheon-api";

// Would be nice to have this as a separate entry point but
// context is defined at module scope so can't be shared between
// entry points.
// https://github.com/facebook/react/issues/19541
export * from "./hooks";
