import { useArticle } from "@pantheon-systems/pcc-react-sdk";
import type { Article } from "@pantheon-systems/pcc-react-sdk";
import {
  ArticleRenderer,
  useArticleTitle,
} from "@pantheon-systems/pcc-react-sdk/components";
import Image from "next/image";
import Link from "next/link";
import React, { useMemo } from "react";
import { getSeoMetadata } from "../lib/utils";
import { clientSmartComponentMap } from "./smart-components";

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
};

const ArticleHeader = ({
  article,
  articleTitle,
  seoMetadata,
}: {
  article: Article;
  articleTitle: string | null;
  seoMetadata: ReturnType<typeof getSeoMetadata>;
}) => {
  return (
    <div>
      <div className="text-5xl font-bold">{articleTitle}</div>
      <div className="border-y-base-300 text-neutral-content mb-14 mt-6 flex w-full flex-row gap-x-4 border-y-[1px] py-4">
        {seoMetadata.openGraph.article.authors?.[0] ? (
          <>
            <Link
              data-testid="author"
              className="flex flex-row items-center gap-x-2 font-thin uppercase text-black no-underline"
              href={`/authors/${seoMetadata.openGraph.article.authors?.[0]}`}
            >
              <div>
                <Image
                  className="m-0 rounded-full"
                  src="/images/no-avatar.png"
                  width={24}
                  height={24}
                  alt={`Avatar of ${seoMetadata.openGraph.article.authors?.[0]}`}
                />
              </div>
              <div className="underline">
                {seoMetadata.openGraph.article.authors?.[0]}
              </div>
            </Link>
            <div className="h-full w-[1px] bg-[#e5e7eb]">&nbsp;</div>
          </>
        ) : null}
        {article.updatedAt ? (
          <span>
            {new Date(article.updatedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        ) : null}
      </div>
    </div>
  );
};

export default function ArticleView({ article }: ArticleViewProps) {
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

  return <StaticArticleView article={hydratedArticle} />;
}

export function StaticArticleView({ article }: ArticleViewProps) {
  const articleTitle = useArticleTitle(article);
  const seoMetadata = getSeoMetadata(article);

  return (
    <>
      <ArticleHeader
        article={article}
        articleTitle={articleTitle}
        seoMetadata={seoMetadata}
      />
      <ArticleRenderer
        componentMap={{
          h1: overrideElementStyles("h1"),
          h2: overrideElementStyles("h2"),
          h3: overrideElementStyles("h3"),
          h4: overrideElementStyles("h4"),
          h5: overrideElementStyles("h5"),
          h6: overrideElementStyles("h6"),
          p: overrideElementStyles("p"),
          li: overrideElementStyles("li"),
          span: overrideElementStyles("span"),
        }}
        article={article}
        smartComponentMap={clientSmartComponentMap}
        __experimentalFlags={{
          preserveImageStyles: true,
          useUnintrusiveTitleRendering: true,
        }}
      />

      <div className="border-base-300 mt-16 flex w-full gap-x-3 border-t-[1px] pt-7 lg:mt-32">
        {seoMetadata.openGraph.article.tags?.length > 0
          ? seoMetadata.openGraph.article.tags.map((x, i) => (
              <div
                key={i}
                className="text-bold text-neutral-content rounded-full border-[1px] border-[#d4d4d4] bg-[#F5F5F5] px-3 py-1 text-sm !no-underline"
              >
                {x}
              </div>
            ))
          : null}
      </div>
    </>
  );
}
