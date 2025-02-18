import {
  PantheonProvider,
  PCCConvenienceFunctions,
  type Article,
} from "@pantheon-systems/pcc-react-sdk";
import { getArticlePathComponentsFromContentStructure } from "@pantheon-systems/pcc-react-sdk/server";
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
          title={seoMetadata.title || undefined}
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
}: {
  req: {
    cookies: Record<string, unknown>;
  };
  query: {
    uri: string[];
    publishingLevel: "PRODUCTION" | "REALTIME" | undefined;
    pccGrant: string;
  };
}) {
  const slugOrId = uri[uri.length - 1];
  const grant = pccGrant || cookies["PCC-GRANT"] || null;

  // Fetch the article and the site in parallel
  const [article, site] = await Promise.all([
    PCCConvenienceFunctions.getArticleBySlugOrId(
      slugOrId,
      publishingLevel
        ? (publishingLevel.toString().toUpperCase() as
            | "PRODUCTION"
            | "REALTIME")
        : "PRODUCTION",
    ),
    PCCConvenienceFunctions.getSite(),
  ]);

  // If the article is not found, return a 404
  if (!article) {
    return {
      notFound: true,
    };
  }

  // Get the article path from the content structure
  const articlePath = getArticlePathComponentsFromContentStructure(
    article,
    site,
  );

  if (
    // Check if the article has a slug
    ((article.slug?.trim().length &&
      // Check if the slug is not the same as the slugOrId
      article.slug.toLowerCase() !== slugOrId?.trim().toLowerCase()) ||
      // Check if the article path is not the same as the uri
      articlePath.length !== uri.length - 1 ||
      // Check if the article path (with all the components together) is not the same as the uri
      articlePath.join("/") !== uri.slice(0, -1).join("/")) &&
    // Check if resolvePath in pantheon API options is not null
    pantheonAPIOptions.resolvePath != null
  ) {
    // If the article was accessed by the id rather than the slug - then redirect to the canonical
    // link (mostly for SEO purposes than anything else).
    // Also if the article was just accessed by slug rather than the path with the content structure
    // then redirect to the canonical link.
    return {
      redirect: {
        destination: queryString.stringifyUrl({
          url: pantheonAPIOptions.resolvePath(article, site),
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
