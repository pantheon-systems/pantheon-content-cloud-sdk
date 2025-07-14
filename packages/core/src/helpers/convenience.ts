import {
  GET_RECOMMENDED_ARTICLES_QUERY,
  PantheonClient,
  PantheonClientConfig,
} from "..";
import type { Article, PaginatedArticle } from "../types";
import {
  getArticleBySlugOrId as _getArticleBySlugOrId,
  getPaginatedArticles as _getPaginatedArticles,
  getArticles,
  getArticlesWithSummary,
} from "./articles";
import { getAllTags } from "./metadata";
import { getSite as _getSite } from "./site";

/* eslint-disable turbo/no-undeclared-env-vars */
const config =
  typeof process === "undefined"
    ? { pccHost: undefined, siteId: "", token: "" }
    : {
        pccHost: (process.env.PCC_HOST ||
          process.env.NEXT_PUBLIC_PCC_HOST) as string,
        siteId: (process.env.PCC_SITE_ID ||
          process.env.NEXT_PUBLIC_PCC_SITE_ID) as string,
        token:
          (process.env.PCC_TOKEN as string) ||
          (process.env.PCC_API_KEY as string),
      };
/* eslint-enable turbo/no-undeclared-env-vars */

export const updateConfig = ({
  pccHost,
  siteId,
  token,
}: Partial<{
  pccHost: string;
  siteId: string;
  token: string;
}>) => {
  config.pccHost = pccHost ?? config.pccHost;
  config.siteId = siteId ?? config.siteId;
  config.token = token ?? config.token;
};

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
    pccHost: config.pccHost,
    siteId: config.siteId,
    apiKey: isClientSide ? "not-needed-on-client" : config.token,
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
  args?: Parameters<typeof _getArticleBySlugOrId>[2],
  related?: Parameters<typeof _getArticleBySlugOrId>[3],
) {
  const post = await _getArticleBySlugOrId(
    buildPantheonClient({ isClientSide: false }),
    id,
    {
      publishingLevel: "PRODUCTION",
      contentType: "TREE_PANTHEON_V2",
      ...args,
    },
    related,
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

async function getSite() {
  const client = buildPantheonClient({ isClientSide: false });
  const site = await _getSite(client, client.siteId);

  return site;
}

export const PCCConvenienceFunctions = {
  buildPantheonClient,
  getAllArticles,
  getAllArticlesWithSummary,
  getArticleBySlugOrId,
  getRecommendedArticles,
  getPaginatedArticles,
  getTags,
  getSite,
};
