import { Article } from "@pantheon-systems/pcc-react-sdk";
import {
  ArticleRenderer,
  getArticleTitle,
} from "@pantheon-systems/pcc-react-sdk/components";
import React from "react";
import { PostGrid } from "../../components/grid";
import Layout from "../../components/layout";
import Seo from "../../components/seo";
import { Tags } from "../../components/tags";

const getSeoMetadata = (article: Article) => {
  const articleTitle = getArticleTitle(article);
  const tags = article.tags && article.tags.length > 0 ? article.tags : [];
  let authors: string[] = [];
  let publishedTime: string | null = null;

  // Collecting data from metadata fields
  Object.entries(article.metadata || {}).forEach(([key, val]: any) => {
    if (key.toLowerCase().trim() === "author" && val) authors = [val];
    else if (key.toLowerCase().trim() === "date" && val.msSinceEpoch)
      publishedTime = new Date(val.msSinceEpoch).toISOString();
  });

  const images = [
    article.metadata?.["Hero Image"],
    // Extend as needed
  ].filter((i): i is string => typeof i === "string");

  return {
    title: `Read ${articleTitle}`,
    description: "Article hosted using Pantheon Content Cloud",
    tags,
    authors,
    publishedTime,
    images,
  };
};

export default function PageTemplate({
  pageContext: { article, recommendedArticles },
}) {
  const seoMetadata = getSeoMetadata(article);
  const articleTitle = getArticleTitle(article);

  return (
    <Layout>
      <Seo
        title={seoMetadata.title || undefined}
        description={seoMetadata.description}
        tags={seoMetadata.tags}
        authors={seoMetadata.authors}
        date={seoMetadata.publishedTime || undefined}
        images={seoMetadata.images}
      />
      <div className="max-w-screen-lg mx-auto mt-16 prose text-black">
        <div>
          <div className="text-3xl font-bold md:text-4xl">{articleTitle}</div>

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
        <ArticleRenderer
          article={article}
          __experimentalFlags={{ useUnintrusiveTitleRendering: true }}
          // TODO: Understand why the compiler is requiring us to provide what should be optional props.
          // [PCC-1151]
          bodyClassName={undefined}
          containerClassName={undefined}
          headerClassName={undefined}
          smartComponentMap={undefined}
          renderTitle={undefined}
          renderBody={undefined}
          previewBarProps={undefined}
          componentMap={undefined}
        />
        <Tags tags={article?.tags} />
        <section>
          <h3>Recommended Articles</h3>
          <PostGrid data={recommendedArticles} FallbackComponent={null} />
        </section>
      </div>
    </Layout>
  );
}
