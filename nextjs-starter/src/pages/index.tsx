import { Open_Sans } from "next/font/google";
import Head from "next/head";

import Header from "@/components/Header";
import ArticleList from "@/components/articles/ArticleList";
import { GetStaticProps } from "next";

import { ArticleWithoutContent, getArticles } from "@pcc/react";
import { pantheonClient } from "@/lib/pantheon";

const openSans = Open_Sans({ subsets: ["latin"] });

interface HomeProps {
  articles: ArticleWithoutContent[];
}

export default function Home({ articles }: HomeProps) {
  return (
    <div>
      <Header />
      <Head>
        <title>Pantheon Documentation</title>
      </Head>

      <main className={`max-w-7xl px-4 py-8 m-auto ${openSans.className}`}>
        <h1 className="text-3xl font-bold md:text-4xl">
          Pantheon Documentation
        </h1>

        <hr className="mt-4 mb-8" />

        <ArticleList articles={articles} />
      </main>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const articles = await getArticles(pantheonClient);

  return {
    props: {
      articles,
    },
  };
};
