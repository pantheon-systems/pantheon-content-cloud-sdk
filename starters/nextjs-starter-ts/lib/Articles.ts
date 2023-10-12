import { getArticles } from "@pantheon-systems/pcc-react-sdk";
import * as PCCReactSDK from "@pantheon-systems/pcc-react-sdk";
import { buildPantheonClientWithGrant } from "./PantheonClient";

export async function getAllArticles(pccGrant?: string) {
  const posts = await getArticles(
    buildPantheonClientWithGrant(pccGrant),
    {
      publishingLevel: "PRODUCTION",
    },
    {
      publishStatus: "published",
    },
  );

  return posts;
}

export async function getArticleBySlugOrId(
  id: number | string,
  pccGrant?: string,
  publishingLevel = "PRODUCTION",
) {
  const post = await PCCReactSDK.getArticleBySlugOrId(
    buildPantheonClientWithGrant(pccGrant),
    id,
    {
      publishingLevel,
      contentType: "TREE_PANTHEON",
    },
  );

  return post;
}
