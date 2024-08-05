"use client";

import { useArticle } from "@pantheon-systems/pcc-react-sdk";
import type { Article } from "@pantheon-systems/pcc-react-sdk";
import {
  ArticleRenderer,
  useArticleTitle,
} from "@pantheon-systems/pcc-react-sdk/components";
import { clientSmartComponentMap } from "./smart-components/client-components";

export default function ArticleView({
  article,
  onlyContent,
}: {
  article: Article;
  onlyContent?: boolean;
}) {
  const { data } = useArticle(
    article.id,
    {
      publishingLevel: article.publishingLevel,
      contentType: "TREE_PANTHEON_V2",
    },
    {
      skip: article.publishingLevel !== "REALTIME",
    },
  );

  const hydratedArticle = data?.article ?? article;
  const title = useArticleTitle(hydratedArticle);

  return (
    <>
      <div>
        <h1 className="text-3xl font-bold md:text-4xl">{title}</h1>
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
      <ArticleRenderer
        article={hydratedArticle}
        smartComponentMap={clientSmartComponentMap}
        __experimentalFlags={{
          disableAllStyles: !!onlyContent,
          preserveImageStyles: true,
          useUnintrusiveTitleRendering: true,
        }}
      />
    </>
  );
}
