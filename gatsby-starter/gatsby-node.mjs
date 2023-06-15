import { getArticles, PantheonClient, getArticle } from "@pcc/react";
import path from "path";

const pccHost = process.env.PCC_HOST;
const pccSiteId = process.env.PCC_SITE_ID;

if (!pccSiteId) {
  throw new Error("PCC_SITE_ID environment variable is required");
}

if (!pccHost) {
  throw new Error("PCC_HOST environment variable is required");
}

const pantheonClient = new PantheonClient({
  pccHost: pccHost,
  siteId: pccSiteId,
});

const createPages = async ({ actions: { createPage } }) => {
  const articles = await getArticles(pantheonClient);

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
    articles.map(async ({ id }) => {
      const article = await getArticle(pantheonClient, id);
      return article;
    })
  );

  articlesWithContent.forEach(async (article) => {
    createPage({
      path: `/articles/${article.id}`,
      component: path.resolve("./src/templates/articles/[slug].js"),
      context: { article },
    });
  });
};

export { createPages };
