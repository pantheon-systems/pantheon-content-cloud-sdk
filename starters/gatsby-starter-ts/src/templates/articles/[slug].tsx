import { Article } from "@pantheon-systems/pcc-react-sdk";
import { ArticleRenderer } from "@pantheon-systems/pcc-react-sdk/components";
import React from "react";
import Layout from "../../components/layout";
import Seo from "../../components/seo";

const getSeoMetadata = (article: Article) => {
  const tags = article.tags && article.tags.length > 0 ? article.tags : [];
  let authors: string[] = [];
  let publishedTime: string | null = null;

  // Collecting data from metadata fields
  Object.entries(article.metadata || {}).forEach(([key, val]: any) => {
    if (key.toLowerCase().trim() === "author" && val) authors = [val];
    else if (key.toLowerCase().trim() === "date" && val.msSinceEpoch)
      publishedTime = new Date(val.msSinceEpoch).toISOString();
  });

  return {
    title: article.title,
    description: "Article hosted using Pantheon Content Cloud",
    tags,
    authors,
    publishedTime,
  };
};

export default function PageTemplate({ pageContext: { article } }) {
  const seoMetadata = getSeoMetadata(article);
  return (
    <Layout>
      <Seo
        title={seoMetadata.title || undefined}
        description={seoMetadata.description}
        tags={seoMetadata.tags}
        authors={seoMetadata.authors}
        date={seoMetadata.publishedTime || undefined}
      />
      <div className="max-w-screen-lg mx-auto mt-16 prose">
        <ArticleRenderer
          article={article}
          renderTitle={(titleElement) => (
            <div>
              <h1 className="text-3xl font-bold md:text-4xl">{titleElement}</h1>

              {article.updatedAt ? (
                <p className="py-2">
                  Last Updated:{" "}
                  {new Date(article.updatedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              ) : null}

              <hr className="mt-6 mb-8" />
            </div>
          )}
          bodyClassName={undefined}
          containerClassName={undefined}
          headerClassName={undefined}
          smartComponentMap={undefined}
        />
      </div>
    </Layout>
  );
}
