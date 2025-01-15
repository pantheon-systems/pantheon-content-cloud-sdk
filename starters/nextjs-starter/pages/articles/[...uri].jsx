import {
  PantheonProvider,
  PCCConvenienceFunctions,
} from "@pantheon-systems/pcc-react-sdk";
import { NextSeo } from "next-seo";
import queryString from "query-string";
import ArticleView from "../../components/article-view";
import Layout from "../../components/layout";
import { getSeoMetadata, getArticlePathFromContentStructure } from "../../lib/utils";
import { getPanthonAPIOptions } from "../api/pantheoncloud/[...command]";

export default function ArticlePage({ article, grant }) {
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

  // Fetch the article and site in parallel
  const [article, site] = await Promise.all([
    PCCConvenienceFunctions.getArticleBySlugOrId(
      slugOrId,
      publishingLevel ? publishingLevel.toString().toUpperCase() : "PRODUCTION",
    ),
    PCCConvenienceFunctions.getSite(process.env.PCC_SITE_ID),
  ]);

  // If the article is not found, return a 404
  if (!article) {
    return {
      notFound: true,
    };
  }

  // Get the article path from the content structure
  const articlePath = getArticlePathFromContentStructure(article, site);

  if (
    (article.slug?.trim().length &&
    article.slug.toLowerCase() !== slugOrId?.trim().toLowerCase()) ||
    articlePath.length !== (uri.length - 1) ||
    articlePath.join("/") !== uri.slice(0, -1).join("/")
  ) {
    // If the article was accessed by the id rather than the slug 
    // or the article path is not the same as the uri - then redirect to the canonical
    // link (mostly for SEO purposes than anything else).
    return {
      redirect: {
        destination: queryString.stringifyUrl({
          url: getPanthonAPIOptions(site).resolvePath(article),
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
