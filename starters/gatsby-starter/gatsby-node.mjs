import path from "path";
import {
  getArticle,
  getArticles,
  getRecommendedArticles,
  PantheonClient,
} from "@pantheon-systems/pcc-react-sdk";

const pccHost = process.env.PCC_HOST;
const pccSiteId = process.env.PCC_SITE_ID;
const pccApiKey = process.env.PCC_API_KEY;

if (process.env.IS_CICD !== "true") {
  if (!pccSiteId) {
    throw new Error("PCC_SITE_ID environment variable is required");
  }

  if (!pccApiKey) {
    throw new Error("PCC_API_KEY environment variable is required");
  }
}

const pantheonClient = new PantheonClient({
  pccHost: pccHost,
  siteId: pccSiteId,
  apiKey: pccApiKey,
});

const createPages = async ({ actions: { createPage } }) => {
  const articles = await getArticles(pantheonClient, {
    publishingLevel: "PRODUCTION",
  });

  createPage({
    path: `/`,
    component: path.resolve("./src/templates/index.js"),
    context: { articles },
  });

  createPage({
    path: `/articles`,
    component: path.resolve("./src/templates/articles/index.js"),
    context: { articles },
  });

  const articlesWithContent = await Promise.all(
    articles.map(async ({ id }) => ({
      article: await getArticle(pantheonClient, id),
      recommendedArticles: await getRecommendedArticles(pantheonClient, id),
    })),
  );

  articlesWithContent.forEach(async ({ article, recommendedArticles }) => {
    createPage({
      path: `/articles/${article.id}`,
      component: path.resolve("./src/templates/articles/[slug].js"),
      context: { article, recommendedArticles },
    });
  });
};

export { createPages };
