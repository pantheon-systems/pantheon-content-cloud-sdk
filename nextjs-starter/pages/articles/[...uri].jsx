import { NextSeo } from "next-seo";
import { ArticleRenderer } from "@pantheon-systems/pcc-react-sdk/components";

import Layout from "../../components/layout";
import { Tags } from "../../components/tags";
import { getArticleById } from "../../lib/Articles";

export default function PageTemplate({ article }) {
  return (
    <Layout>
      <NextSeo
        title="Decoupled PCC Demo"
        description="Generated by create-pantheon-decoupled-kit."
      />

      <div className="max-w-screen-lg mx-auto prose mt-16">
        <ArticleRenderer
          article={article}
          renderTitle={(titleElement) => (
            <div>
              <h1 className="text-3xl font-bold md:text-4xl">{titleElement}</h1>

              <p className="py-2">
                Last Updated:{" "}
                {new Date(article.publishedDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>

              <hr className="mt-6 mb-8" />
            </div>
          )}
        />
        <Tags tags={article?.tags} />
      </div>
    </Layout>
  );
}

export async function getServerSideProps({ params: { uri } }) {
  const id = uri[uri.length - 1];
  const article = await getArticleById(id);

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
}