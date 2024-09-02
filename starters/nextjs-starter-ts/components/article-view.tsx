import { useArticle } from "@pantheon-systems/pcc-react-sdk";
import type { Article } from "@pantheon-systems/pcc-react-sdk";
import {
  ArticleRenderer,
  useArticleTitle,
} from "@pantheon-systems/pcc-react-sdk/components";
import React, { useMemo } from "react";
import { clientSmartComponentMap } from "./smart-components";

const removeElementStyles = (headerTag: keyof HTMLElementTagNameMap) => {
  function resultFunc({ children, id, style: _, ...attrs }: any) {
    return React.createElement(headerTag, { id, attrs }, children);
  }
  return resultFunc;
};

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

  const hydratedArticle = useMemo(
    () => data?.article ?? article,
    [data, article],
  );

  return (
    <StaticArticleView article={hydratedArticle} onlyContent={onlyContent} />
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
        componentMap={{
          h1: removeElementStyles("h1"),
          h2: removeElementStyles("h2"),
          h3: removeElementStyles("h3"),
          h4: removeElementStyles("h4"),
          h5: removeElementStyles("h5"),
          h6: removeElementStyles("h6"),
          p: removeElementStyles("p"),
          span: removeElementStyles("span"),
        }}
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
