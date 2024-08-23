import { PCCConvenienceFunctions } from "@pantheon-systems/pcc-react-sdk/server";
import { Metadata } from "next";
import { unstable_cache } from "next/cache";
import { notFound } from "next/navigation";
import { StaticArticleView } from "../../../../components/article-view";
import { ArticleGrid } from "../../../../components/grid";
import Layout from "../../../../components/layout";
import { getSeoMetadata } from "../../../../lib/utils";

interface ArticlePageProps {
  params: { uri: string };
}

export const revalidate = 21600; // revalidate every 6 hours

export default async function ArticlePage({ params }: ArticlePageProps) {
  const article = await PCCConvenienceFunctions.getArticleBySlugOrId(
    params.uri,
    "PRODUCTION",
  );

  if (!article) {
    return notFound();
  }

  const recommendedArticles =
    await PCCConvenienceFunctions.getRecommendedArticles(article.id);

  return (
    <Layout>
      <div className="prose mx-4 mt-16 text-black sm:mx-6 md:mx-auto">
        <StaticArticleView article={article} />

        <section>
          <h3>Recommended Articles</h3>
          <ArticleGrid
            articles={recommendedArticles}
            basePath={"/examples/ssg-isr"}
          />
        </section>
      </div>
    </Layout>
  );
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const article = await PCCConvenienceFunctions.getArticleBySlugOrId(
    params.uri,
    "PRODUCTION",
  );

  return getSeoMetadata(article);
}

export async function generateStaticParams() {
  const publishedArticles = await PCCConvenienceFunctions.getAllArticles(
    {
      publishingLevel: "PRODUCTION",
    },
    {
      publishStatus: "published",
    },
  );

  return publishedArticles.flatMap((article) => {
    const params = [{ uri: article.id }];
    if (article.metadata.slug) {
      params.push({ uri: String(article.metadata.slug) });
    }
    return params;
  });
}
