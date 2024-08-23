"use client";

import { useArticle } from "@pantheon-systems/pcc-react-sdk";
import type { Article } from "@pantheon-systems/pcc-react-sdk";
import {
  ArticleRenderer,
  useArticleTitle,
} from "@pantheon-systems/pcc-react-sdk/components";
import { clientSmartComponentMap } from "./smart-components/client-components";

type ArticleViewProps = {
  article: Article;
  onlyContent?: boolean;
};

export default function ArticleView({
  article,
  onlyContent,
}: ArticleViewProps) {
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
        <h1 className="text-5xl font-bold">{title}</h1>
        {article.updatedAt ? (
          <p className="py-2">
            {new Date(article.updatedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        ) : null}
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

export function StaticArticleView({ article, onlyContent }: ArticleViewProps) {
  const articleTitle = useArticleTitle(article);

  return (
    <>
      <div>
        <div className="text-5xl font-bold">{articleTitle}</div>

        {article.updatedAt ? (
          <p className="py-2">
            {new Date(article.updatedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        ) : null}
      </div>
      <ArticleRenderer
        article={article}
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
