import {
  PantheonProvider,
  PCCConvenienceFunctions,
  type Article,
} from "@pantheon-systems/pcc-react-sdk";
import { NextSeo } from "next-seo";
import queryString from "query-string";
import ArticleView from "../../components/article-view";
import Layout from "../../components/layout";
import { getSeoMetadata } from "../../lib/utils";
import { pantheonAPIOptions } from "../api/pantheoncloud/[...command]";

interface ArticlePageProps {
  article: Article;
  grant: string;
}

export default function ArticlePage({ article, grant }: ArticlePageProps) {
  const seoMetadata = getSeoMetadata(article);

  return (
    <PantheonProvider
      client={PCCConvenienceFunctions.buildPantheonClient({
        isClientSide: true,
        pccGrant: grant,
      })}
    >
      <Layout>
        <NextSeo
          title={seoMetadata.title}
          description={seoMetadata.description}
          openGraph={seoMetadata.openGraph}
        />

        <div className="prose mx-4 mt-16 text-black sm:mx-6 md:mx-auto">
          <ArticleView article={article} />
        </div>
      </Layout>
    </PantheonProvider>
  );
}

export async function getServerSideProps({
  req: { cookies },
  query: { uri, publishingLevel, pccGrant, ...query },
}) {
  const slugOrId = uri[uri.length - 1];
  const grant = pccGrant || cookies["PCC-GRANT"] || null;

  const article = await PCCConvenienceFunctions.getArticleBySlugOrId(
    slugOrId,
    publishingLevel ? publishingLevel.toString().toUpperCase() : "PRODUCTION",
  );

  if (!article) {
    return {
      notFound: true,
    };
  }

  if (
    article.slug?.trim().length &&
    article.slug.toLowerCase() !== slugOrId?.trim().toLowerCase()
  ) {
    // If the article was accessed by the id rather than the slug - then redirect to the canonical
    // link (mostly for SEO purposes than anything else).
    return {
      redirect: {
        destination: queryString.stringifyUrl({
          url: pantheonAPIOptions.resolvePath(article),
          query: { publishingLevel, ...query },
        }),
        permanent: false,
      },
    };
  }

  return {
    props: {
      article,
      grant,
      recommendedArticles: await PCCConvenienceFunctions.getRecommendedArticles(
        article.id,
      ),
    },
  };
}
