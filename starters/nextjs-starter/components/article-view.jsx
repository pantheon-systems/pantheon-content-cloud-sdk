import { useArticle } from "@pantheon-systems/pcc-react-sdk";
import {
  ArticleRenderer,
  useArticleTitle,
} from "@pantheon-systems/pcc-react-sdk/components";
import React, { useMemo } from "react";
import { clientSmartComponentMap } from "./smart-components";

const ELEMENT_STYLES_TO_OVERRIDE = [
  /fontSize/,
  /fontWeight/,
  /padding(Left|Right|Top|Bottom)*/,
  /margin(Left|Right|Top|Bottom)*/,
  /lineHeight/,
  /height/,
];
const overrideElementStyles = (tag) => {
  function resultFunc({ children, id, style, ...attrs }) {
    const newStyles = { ...style };
    ELEMENT_STYLES_TO_OVERRIDE.forEach((s) => {
      Object.keys(newStyles).forEach((key) => {
        if (s.test(key)) delete newStyles[key];
      });
    });
    return React.createElement(
      tag,
      { id, style: newStyles, ...attrs },
      children,
    );
  }
  return resultFunc;
};

export default function ArticleView({ article, onlyContent }) {
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

export function StaticArticleView({ article, onlyContent }) {
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
        componentMap={{
          h1: overrideElementStyles("h1"),
          h2: overrideElementStyles("h2"),
          h3: overrideElementStyles("h3"),
          h4: overrideElementStyles("h4"),
          h5: overrideElementStyles("h5"),
          h6: overrideElementStyles("h6"),
          p: overrideElementStyles("p"),
          span: overrideElementStyles("span"),
        }}
        smartComponentMap={clientSmartComponentMap}
        __experimentalFlags={{
          useUnintrusiveTitleRendering: true,
          disableAllStyles: !!onlyContent,
        }}
      />
    </>
  );
}
