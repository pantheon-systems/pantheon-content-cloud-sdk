import { PantheonClient } from "..";
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
    pccHost: process.env.PCC_HOST as string,
    siteId: process.env.PCC_SITE_ID as string,
    apiKey: isClientSide
      ? "not-needed-on-client"
      : (process.env.PCC_TOKEN as string),
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

export const PCCConvenienceFunctions = {
  buildPantheonClient,
  getAllArticles,
  getArticleBySlugOrId,
  getTags,
};
