import { Article, GET_RECOMMENDED_ARTICLES_QUERY, PantheonClient } from "..";
import { getArticle, getArticles } from "./articles";
import { getAllTags } from "./metadata";

const buildPantheonClient = ({
  isClientSide,
  pccGrant,
}: {
  isClientSide: boolean;
  pccGrant?: string | undefined;
}) => {
  return new PantheonClient({
    // eslint-disable-next-line turbo/no-undeclared-env-vars
    pccHost: process.env.PCC_HOST as string,
    // eslint-disable-next-line turbo/no-undeclared-env-vars
    siteId: process.env.PCC_SITE_ID as string,
    apiKey: isClientSide
      ? "not-needed-on-client"
      : // eslint-disable-next-line turbo/no-undeclared-env-vars
        (process.env.PCC_TOKEN as string),
    pccGrant,
  });
};

/**
 * Helper functions meant to be used in server-side rendering
 */

async function getAllArticles(
  args?: Parameters<typeof getArticles>[1],
  options?: Parameters<typeof getArticles>[2],
) {
  const posts = await getArticles(
    buildPantheonClient({ isClientSide: false }),
    {
      publishingLevel: "PRODUCTION",
      ...args,
    },
    {
      publishStatus: "published",
      ...options,
    },
  );

  return posts;
}

async function getArticleBySlugOrId(
  id: number | string,
  publishingLevel: "PRODUCTION" | "REALTIME" = "PRODUCTION",
) {
  const post = await getArticle(
    buildPantheonClient({ isClientSide: false }),
    id,
    {
      publishingLevel,
      contentType: "TREE_PANTHEON",
    },
  );

  return post;
}

async function getTags() {
  const tags = await getAllTags(buildPantheonClient({ isClientSide: false }));
  return tags;
}

async function getRecommendedArticles(id: number | string) {
  const article = await buildPantheonClient({
    isClientSide: false,
  }).apolloClient.query({
    query: GET_RECOMMENDED_ARTICLES_QUERY,
    variables: { id: id.toString() },
  });

  return article.data.recommendedArticles as Article[];
}

export const PCCConvenienceFunctions = {
  buildPantheonClient,
  getAllArticles,
  getArticleBySlugOrId,
  getRecommendedArticles,
  getTags,
};
