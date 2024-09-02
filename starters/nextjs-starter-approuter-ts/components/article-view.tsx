"use client";

import { useArticle } from "@pantheon-systems/pcc-react-sdk";
import type { Article } from "@pantheon-systems/pcc-react-sdk";
import {
  ArticleRenderer,
  useArticleTitle,
} from "@pantheon-systems/pcc-react-sdk/components";
import React from "react";
import { clientSmartComponentMap } from "./smart-components/client-components";

const ELEMENT_STYLES_TO_OVERRIDE = [
  /fontSize/,
  /fontWeight/,
  /padding(Left|Right|Top|Bottom)*/,
  /margin(Left|Right|Top|Bottom)*/,
  /lineHeight/,
  /height/,
];
const overrideElementStyles = (tag: keyof HTMLElementTagNameMap) => {
  function resultFunc({ children, id, style, ...attrs }: any) {
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
          disableAllStyles: !!onlyContent,
          preserveImageStyles: true,
          useUnintrusiveTitleRendering: true,
        }}
      />
    </>
  );
}
