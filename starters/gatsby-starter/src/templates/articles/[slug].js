import { ArticleRenderer } from "@pantheon-systems/pcc-react-sdk/components";
import React from "react";
import Layout from "../../components/layout";

export default function PageTemplate({ pageContext: { article } }) {
  return (
    <Layout>
      <div className="max-w-screen-lg mx-auto mt-16 prose">
        <ArticleRenderer
          article={article}
          renderTitle={(titleElement) => (
            <div>
              <h1 className="text-3xl font-bold md:text-4xl">{titleElement}</h1>

              <p className="py-2">
                Last Updated:{" "}
                {new Date(article.updatedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>

              <hr className="mt-6 mb-8" />
            </div>
          )}
        />
      </div>
    </Layout>
  );
}
