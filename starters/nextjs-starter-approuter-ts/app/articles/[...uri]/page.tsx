import { Suspense } from "react";
import Layout from "../../../components/layout";
import { SkeletonArticleView } from "../../../components/skeleton-article-view";
import { ArticleView, getServersideArticle } from "./article-view";

export default async function ArticlePage({ params, searchParams }) {
  return (
    <Layout>
      <div className="prose mx-4 mt-16 text-black sm:mx-6 md:mx-auto">
        <Suspense fallback={<SkeletonArticleView />}>
          <ArticleView params={params} searchParams={searchParams} />
        </Suspense>
      </div>
    </Layout>
  );
}

interface DateInputObject {
  msSinceEpoch: string;
}

function isDateInputObject(v: DateInputObject | unknown): v is DateInputObject {
  return (v as DateInputObject).msSinceEpoch != null;
}

export async function generateMetadata({ params, searchParams }) {
  const { article, grant } = await getServersideArticle(params, searchParams);
  const tags = article.tags && article.tags.length > 0 ? article.tags : [];
  let authors = [];
  let publishedTime = null;

  // Collecting data from metadata fields
  Object.entries(article.metadata || {}).forEach(([key, val]) => {
    if (key.toLowerCase().trim() === "author" && val) authors = [val];
    else if (key.toLowerCase().trim() === "date" && isDateInputObject(val))
      publishedTime = new Date(val.msSinceEpoch).toISOString();
  });

  const imageProperties = [
    article.metadata?.["Hero Image"],
    // Extend as needed
  ]
    .filter((url): url is string => typeof url === "string")
    .map((url) => ({ url }));

  const description = "Article hosted using Pantheon Content Cloud";

  return {
    title: article.title,
    description,
    openGraph: {
      type: "website",
      title: article.title,
      description,
      images: imageProperties,
      article: {
        authors,
        tags,
        ...(publishedTime && {
          publishedTime,
        }),
      },
    },
  };
}
