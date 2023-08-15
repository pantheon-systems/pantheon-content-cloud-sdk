import { ArticleRenderer } from "@pantheon-systems/pcc-react-sdk/components";
import { NextSeo } from "next-seo";
import Layout from "../../components/layout";
import LeadCapture from "../../components/smart-components/lead-capture";
import { Tags } from "../../components/tags";
import { getArticleById } from "../../lib/Articles";

export default function PageTemplate({ article }) {
  return (
    <Layout>
      <NextSeo
        title="Decoupled PCC Demo"
        description="Generated by create-pantheon-decoupled-kit."
      />

      <div className="max-w-screen-lg mx-auto mt-16 prose">
        <ArticleRenderer
          article={article}
          renderTitle={(titleElement) => (
            <div>
              <h1 className="text-3xl font-bold md:text-4xl">{titleElement}</h1>

              {article.updatedAt ? (
                <p className="py-2">
                  Last Updated:{" "}
                  {new Date(article.updatedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              ) : null}

              <hr className="mt-6 mb-8" />
            </div>
          )}
          smartComponentMap={{ LEAD_CAPTURE: LeadCapture }}
        />
        <Tags tags={article?.tags} />
      </div>
    </Layout>
  );
}

export async function getServerSideProps({
  params: { uri },
  req: { cookies },
}) {
  const id = uri[uri.length - 1];
  const article = await getArticleById(id, cookies["PCC-GRANT"]);

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
