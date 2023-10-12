import { getArticles } from "@pantheon-systems/pcc-react-sdk";
import * as PCCReactSDK from "@pantheon-systems/pcc-react-sdk";
import { buildPantheonClientWithGrant } from "./PantheonClient";

export async function getAllArticles(pccGrant) {
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
  id,
  pccGrant,
  publishingLevel = "PRODUCTION",
) {
  const post = await PCCReactSDK.getArticleBySlugOrId(
    buildPantheonClientWithGrant(pccGrant),
    id,
    {
      publishingLevel: publishingLevel,
      contentType: "TREE_PANTHEON",
    },
  );

  return post;
}
