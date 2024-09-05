import {
  PCCConvenienceFunctions,
  type Article,
} from "@pantheon-systems/pcc-react-sdk";
import { GetStaticPaths, GetStaticProps } from "next";
import { NextSeo } from "next-seo";
import { StaticArticleView } from "../../../components/article-view";
import { PageGrid } from "../../../components/grid";
import Layout from "../../../components/layout";
import { Tags } from "../../../components/tags";
import { getSeoMetadata } from "../../experimental/content-only/[...uri]";

interface ArticlePageProps {
  article: Article;
  recommendedArticles: Article[];
}

export default function ArticlePage({
  article,
  recommendedArticles,
}: ArticlePageProps) {
  const seoMetadata = getSeoMetadata(article);

  return (
    <Layout>
      <NextSeo
        title={seoMetadata.title}
        description={seoMetadata.description}
        openGraph={{
          type: "website",
          title: seoMetadata.title,
          description: seoMetadata.description,
          article: {
            authors: seoMetadata.authors,
            tags: seoMetadata.tags,
            ...(seoMetadata.publishedTime && {
              publishedTime: seoMetadata.publishedTime,
            }),
          },
        }}
      />

      <div className="max-w-screen-lg mx-auto mt-16 prose text-black">
        <StaticArticleView article={article} />

        <Tags tags={article?.tags} />
        <section>
          <h3>Recommended Articles</h3>
          <PageGrid data={recommendedArticles} basePath={"/examples/ssg-isr"} />
        </section>
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

    const recommendedArticles =
      await PCCConvenienceFunctions.getRecommendedArticles(article.id);

    return {
      props: {
        article,
        recommendedArticles,
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
