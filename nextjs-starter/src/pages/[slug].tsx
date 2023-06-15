import { Open_Sans } from "next/font/google";
import Head from "next/head";
import { GetStaticPaths, GetStaticProps } from "next";

import Header from "@/components/Header";
import { Article, getArticle, getArticles } from "@pcc/react";
import { ArticleRenderer } from "@pcc/react/components";
import { pantheonClient } from "@/lib/pantheon";

const openSans = Open_Sans({ subsets: ["latin"] });

interface Props {
  slug: string;
  article: Article;
}

export default function ArticlePage({ article }: Props) {
  return (
    <div>
      <Header />
      <Head>
        <title>
          {article
            ? `${article.title} - Pantheon Documentation`
            : "Pantheon Documentation"}
        </title>
      </Head>

      <main className={`max-w-7xl px-4 py-12 m-auto ${openSans.className}`}>
        <div className="!max-w-full prose">
          <div className="pt-4">
            {/* Article content */}
            <ArticleRenderer
              renderTitle={(titleElement) => {
                return (
                  <div>
                    <h1 className="text-3xl font-bold md:text-4xl">
                      {titleElement}
                    </h1>

                    <p className="py-2">
                      Last Updated:{" "}
                      {new Date(
                        article?.publishedDate || "2023-01-01"
                      ).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>

                    <hr className="mt-6 mb-8" />
                  </div>
                );
              }}
              article={article}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params || {};

  if (!slug) {
    return {
      notFound: true,
    };
  }

  const article = await getArticle(pantheonClient, slug.toString());

  return {
    props: {
      slug,
      article,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const articles = await getArticles(pantheonClient);

  const paths = articles.map((article) => ({
    params: { slug: article.id },
  }));

  return {
    paths,
    fallback: true,
  };
};
