import { 
  PCCConvenienceFunctions,
  getArticlePathComponentsFromContentStructure
 } from "@pantheon-systems/pcc-react-sdk/server";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { StaticArticleView } from "../../../../components/article-view";
import Layout from "../../../../components/layout";
import { getSeoMetadata } from "../../../../lib/utils";

interface ArticlePageProps {
  params: { uri: string[] };
}

export const revalidate = 21600; // revalidate every 6 hours

export default async function ArticlePage({ params }: ArticlePageProps) {
  const article = await PCCConvenienceFunctions.getArticleBySlugOrId(
    params.uri[params.uri.length - 1],
    "PRODUCTION",
  );

  if (!article) {
    return notFound();
  }

  return (
    <Layout>
      <div className="prose mx-4 mt-16 text-black sm:mx-6 md:mx-auto">
        <StaticArticleView article={article} />
      </div>
    </Layout>
  );
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const article = await PCCConvenienceFunctions.getArticleBySlugOrId(
    params.uri[params.uri.length - 1],
    "PRODUCTION",
  );

  return getSeoMetadata(article);
}

export async function generateStaticParams() {
  // Get all published articles and the site in prallel
  const [publishedArticles, site] = await Promise.all([
    PCCConvenienceFunctions.getAllArticles(
      {
        publishingLevel: "PRODUCTION",
      },
      {
        publishStatus: "published",
      },
    ),
    PCCConvenienceFunctions.getSite(),
  ]);

  return publishedArticles.flatMap((article) => {
    // Generate the article path from the contnet structure
    const articlePath = getArticlePathComponentsFromContentStructure(
      article,
      site,
    );

    const id = article.id

    // Add the ID to the article path
    articlePath.push(id)

    // Add a copy of the article path with the slug
    const params = [{ uri: articlePath.slice() }];
    if (article.metadata?.slug) {
      // Change the ID in the article path to the slug
      articlePath[articlePath.length - 1] = String(article.metadata.slug)

      params.push({ uri: articlePath });
    }
    return params;
  });
}
