import {
  ArticleRenderer,
  getArticleTitle,
} from "@pantheon-systems/pcc-react-sdk/components";
import React from "react";
import Layout from "../../components/layout";
import Seo from "../../components/seo";

const getSeoMetadata = (article) => {
  const articleTitle = getArticleTitle(article);
  const tags = article.tags && article.tags.length > 0 ? article.tags : [];
  let authors = [];
  let publishedTime = null;

  // Collecting data from metadata fields
  Object.entries(article.metadata || {}).forEach(([key, val]) => {
    if (key.toLowerCase().trim() === "author" && val) authors = [val];
    else if (key.toLowerCase().trim() === "date" && val.msSinceEpoch)
      publishedTime = new Date(val.msSinceEpoch).toISOString();
  });

  const images = [
    article.metadata?.["Hero Image"],
    // Extend as needed
  ].filter((url) => typeof url === "string");

  return {
    title: `Read ${articleTitle}`,
    description: "Article hosted using Pantheon Content Cloud",
    tags,
    authors,
    publishedTime,
    images,
  };
};

export default function PageTemplate({ pageContext: { article } }) {
  const seoMetadata = getSeoMetadata(article);
  const articleTitle = getArticleTitle(article);

  return (
    <Layout>
      <Seo
        title={seoMetadata.title}
        description={seoMetadata.description}
        tags={seoMetadata.tags}
        authors={seoMetadata.authors}
        date={seoMetadata.publishedTime}
        images={seoMetadata.images}
      />
      <div className="prose mx-4 mt-16 text-black sm:mx-6 lg:mx-auto">
        <div>
          <div className="text-5xl font-bold">{articleTitle}</div>

          {article.updatedAt ? (
            <p className="py-2">
              {new Date(article.updatedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          ) : null}
        </div>
        <ArticleRenderer
          article={article}
          __experimentalFlags={{ useUnintrusiveTitleRendering: true }}
        />
      </div>
    </Layout>
  );
}
