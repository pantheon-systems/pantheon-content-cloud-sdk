import { Suspense } from "react";
import Layout from "../../../components/layout";
import { SkeletonArticleView } from "../../../components/skeleton-article-view";
import { getSeoMetadata } from "../../../lib/utils";
import {
  ArticleView,
  ArticleViewProps,
  getServersideArticle,
} from "./article-view";

export default async function ArticlePage({
  params,
  searchParams,
}: ArticleViewProps) {
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

export async function generateMetadata({
  params,
  searchParams,
}: ArticleViewProps) {
  const { article } = await getServersideArticle({ params, searchParams });

  return getSeoMetadata(article);
}
