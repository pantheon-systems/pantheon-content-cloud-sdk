import {
  getArticleBySlugOrId,
  getRecommendedArticles,
} from "@pantheon-systems/pcc-vue-sdk";
import { getPantheonClient } from "../../lib/pantheon";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  const { publishingLevel = "PRODUCTION" } = getQuery(event);

  if (!id || typeof id !== "string") {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing id",
    });
  }

  if (publishingLevel !== "PRODUCTION" && publishingLevel !== "REALTIME") {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid publishing level",
    });
  }

  const [article, recommendedArticles] = await Promise.all([
    await getArticleBySlugOrId(getPantheonClient(), id, {
      publishingLevel: publishingLevel,
    }),
    await getRecommendedArticles(getPantheonClient(), id),
  ]);

  return {
    article,
    recommendedArticles,
  };
});
