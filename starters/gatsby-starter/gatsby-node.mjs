import path from "path";
import {
  getArticle,
  PantheonClient,
  PCCConvenienceFunctions,
} from "@pantheon-systems/pcc-react-sdk";

const pccHost = process.env.PCC_HOST;
const pccSiteId = process.env.PCC_SITE_ID;
const pccApiKey = process.env.PCC_TOKEN;
const PAGE_SIZE = 20;

if (process.env.IS_CICD !== "true") {
  if (!pccSiteId) {
    throw new Error("PCC_SITE_ID environment variable is required");
  }

  if (!pccApiKey) {
    throw new Error("PCC_TOKEN environment variable is required");
  }
}

const pantheonClient = new PantheonClient({
  pccHost: pccHost,
  siteId: pccSiteId,
  apiKey: pccApiKey,
});

const createPages = async ({ actions: { createPage } }) => {
  const articles = await PCCConvenienceFunctions.getAllArticles(
    {
      publishingLevel: "PRODUCTION",
    },
    {
      publishStatus: "published",
    },
  );

  const numPages = Math.ceil(articles.length / PAGE_SIZE);
  Array.from({ length: numPages }).forEach((_, page) => {
    const currentArticles = articles.slice(
      page * PAGE_SIZE,
      page * PAGE_SIZE + PAGE_SIZE,
    );
    createPage({
      path: page === 0 ? `/` : `/${page + 1}`,
      component: path.resolve("./src/templates/index.js"),
      context: {
        articles: currentArticles,
        totalCount: articles.length,
        currentPage: page,
        pageSize: PAGE_SIZE,
      },
    });
    createPage({
      path: page === 0 ? `/articles` : `/articles/${page + 1}`,
      component: path.resolve("./src/templates/articles/index.js"),
      context: {
        articles: currentArticles,
        totalCount: articles.length,
        currentPage: page,
        pageSize: PAGE_SIZE,
      },
    });
  });

  const articlesWithContent = await Promise.all(
    articles.map(async ({ id }) => {
      const [article] = await Promise.all([
        await getArticle(pantheonClient, id),
      ]);

      return { article };
    }),
  );

  articlesWithContent.forEach(async ({ article }) => {
    createPage({
      path: `/articles/${article.id}`,
      component: path.resolve("./src/templates/articles/[slug].js"),
      context: { article },
    });

    // Create slug-based pages
    if (article.slug) {
      createPage({
        path: `/articles/${article.slug}`,
        component: path.resolve("./src/templates/articles/[slug].js"),
        context: { article },
      });
    }
  });
};

export { createPages };
