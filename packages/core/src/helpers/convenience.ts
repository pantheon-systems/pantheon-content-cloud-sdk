import { PantheonClient, PantheonClientConfig } from "..";
import {
  getArticleBySlugOrId as _getArticleBySlugOrId,
  getArticles,
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
  const posts = await getArticles(
    PCCConvenienceFunctions.buildPantheonClient({ isClientSide: false }),
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
  const post = await _getArticleBySlugOrId(
    PCCConvenienceFunctions.buildPantheonClient({ isClientSide: false }),
    id,
    {
      publishingLevel,
      contentType: "TREE_PANTHEON",
    },
  );

  return post;
}

async function getTags() {
  const tags = await getAllTags(
    PCCConvenienceFunctions.buildPantheonClient({ isClientSide: false }),
  );
  return tags;
}

export const PCCConvenienceFunctions = {
  buildPantheonClient,
  getAllArticles,
  getArticleBySlugOrId,
  getTags,
};
