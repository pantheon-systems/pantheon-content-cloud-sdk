import { getArticle, getArticles } from "@pantheon-systems/pcc-react-sdk";
import * as PCCReactSDK from "@pantheon-systems/pcc-react-sdk";
import { buildPantheonClientWithGrant } from "./PantheonClient";

export async function getAllArticles(pccGrant) {
  const posts = await getArticles(buildPantheonClientWithGrant(pccGrant), {
    publishingLevel: "PRODUCTION",
  });

  return posts;
}

export async function getArticleById(id, pccGrant) {
  const post = await getArticle(buildPantheonClientWithGrant(pccGrant), id, {
    publishingLevel: "PRODUCTION",
    contentType: "TREE_PANTHEON",
  });

  return post;
}

export async function getArticleBySlugOrId(id, pccGrant) {
  const post = await PCCReactSDK.getArticleBySlugOrId(
    buildPantheonClientWithGrant(pccGrant),
    id,
    {
      publishingLevel: "PRODUCTION",
      contentType: "TREE_PANTHEON",
    },
  );

  return post;
}
