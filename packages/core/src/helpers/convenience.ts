import {
  Article,
  GET_RECOMMENDED_ARTICLES_QUERY,
  PantheonClient,
  PantheonClientConfig,
} from "..";
import { PaginatedArticle } from "../types";
import {
  getArticleBySlugOrId as _getArticleBySlugOrId,
  getPaginatedArticles as _getPaginatedArticles,
  getArticles,
  getArticlesWithSummary,
} from "./articles";
import { getAllTags } from "./metadata";

const buildPantheonClient = ({
  isClientSide,
  pccGrant,
  ...props
}: {
  isClientSide: boolean;
  pccGrant?: string | undefined;
  props?: Partial<PantheonClientConfig>;
}) => {
  return new PantheonClient({
    // eslint-disable-next-line turbo/no-undeclared-env-vars
    pccHost: process.env.PCC_HOST as string,
    // eslint-disable-next-line turbo/no-undeclared-env-vars
    siteId: process.env.PCC_SITE_ID as string,
    apiKey: isClientSide
      ? "not-needed-on-client"
      : // eslint-disable-next-line turbo/no-undeclared-env-vars
        (process.env.PCC_TOKEN as string) ||
        // eslint-disable-next-line turbo/no-undeclared-env-vars
        (process.env.PCC_API_KEY as string),
    pccGrant,
    ...props,
  });
};

/**
 * Helper functions meant to be used in server-side rendering
 */

async function getAllArticles(
  args?: Parameters<typeof getArticles>[1],
  options?: Parameters<typeof getArticles>[2],
) {
  return (await getAllArticlesWithSummary(args, options, false)).articles;
}

async function getPaginatedArticles(
  args?: Parameters<typeof _getPaginatedArticles>[1],
  searchParams?: Parameters<typeof _getPaginatedArticles>[2],
): Promise<PaginatedArticle> {
  return await _getPaginatedArticles(
    buildPantheonClient({ isClientSide: false }),
    {
      publishingLevel: "PRODUCTION",
      ...args,
    },
    {
      publishStatus: "published",
      ...searchParams,
    },
    false,
  );
}

async function getAllArticlesWithSummary(
  args?: Parameters<typeof getArticles>[1],
  options?: Parameters<typeof getArticles>[2],
  withSummary?: boolean,
) {
  const posts = await getArticlesWithSummary(
    buildPantheonClient({ isClientSide: false }),
    {
      publishingLevel: "PRODUCTION",
      ...args,
    },
    {
      publishStatus: "published",
      ...options,
    },
    false,
    withSummary,
  );

  return posts;
}

async function getArticleBySlugOrId(
  id: number | string,
  publishingLevel: "PRODUCTION" | "REALTIME" = "PRODUCTION",
) {
  const post = await _getArticleBySlugOrId(
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
  getAllArticlesWithSummary,
  getArticleBySlugOrId,
  getRecommendedArticles,
  getPaginatedArticles,
  getTags,
};
