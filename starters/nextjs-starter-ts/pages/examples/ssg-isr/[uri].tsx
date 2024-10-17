import {
  PCCConvenienceFunctions,
  type Article,
} from "@pantheon-systems/pcc-react-sdk";
import { GetStaticPaths, GetStaticProps } from "next";
import { NextSeo } from "next-seo";
import { StaticArticleView } from "../../../components/article-view";
import Layout from "../../../components/layout";
import { getSeoMetadata } from "../../../lib/utils";

interface ArticlePageProps {
  article: Article;
}

export default function ArticlePage({ article }: ArticlePageProps) {
  const seoMetadata = getSeoMetadata(article);

  return (
    <Layout>
      <NextSeo
        title={seoMetadata.title}
        description={seoMetadata.description}
        openGraph={seoMetadata.openGraph}
      />

      <div className="prose mx-4 mt-16 text-black sm:mx-6 md:mx-auto">
        <StaticArticleView article={article} />
      </div>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps<{}, { uri: string }> = async ({
  params: { uri },
}) => {
  if (!uri) {
    return {
      notFound: true,
    };
  }

  try {
    const article = await PCCConvenienceFunctions.getArticleBySlugOrId(uri);

    if (!article) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        article,
      },
    };
  } catch (e) {
    console.error(e);
    return {
      notFound: true,
    };
  }
};

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const publishedArticles = await PCCConvenienceFunctions.getAllArticles(
      {
        publishingLevel: "PRODUCTION",
      },
      {
        publishStatus: "published",
      },
    );

    const pagePaths = publishedArticles.map((article) => {
      const id = article.id;
      const slug = article.metadata.slug;

      // Generate both slug and id paths for each article
      const paths = [
        {
          params: {
            uri: id,
          },
        },
      ];

      if (slug) {
        paths.push({
          params: {
            uri: String(slug),
          },
        });
      }

      return paths;
    });

    return {
      paths: pagePaths.flat(),
      fallback: "blocking",
    };
  } catch (e) {
    console.error(e);

    return {
      paths: [],
      fallback: "blocking",
    };
  }
};
