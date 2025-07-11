import { useArticle } from "@pantheon-systems/pcc-react-sdk";
import { ArticleRenderer } from "@pantheon-systems/pcc-react-sdk/components";
import Image from "next/image";
import Link from "next/link";
import React from "react";
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

const componentOverrideMap = {
  h1: overrideElementStyles("h1"),
  h2: overrideElementStyles("h2"),
  h3: overrideElementStyles("h3"),
  h4: overrideElementStyles("h4"),
  h5: overrideElementStyles("h5"),
  h6: overrideElementStyles("h6"),
  p: overrideElementStyles("p"),
  span: overrideElementStyles("span"),
};

const ArticleHeader = ({ article, seoMetadata }) => {
  const author = Array.isArray(seoMetadata.authors)
    ? seoMetadata.authors[0]
    : seoMetadata.authors;

  if (!author?.name && !article.updatedAt) return null;

  return (
    <div className="border-b-base-300 text-neutral-content mb-14 mt-6 flex w-full flex-row gap-x-4 border-b-[1px] py-4">
      {author?.name ? (
        <>
          <Link
            data-testid="author"
            className="flex flex-row items-center gap-x-2 font-thin uppercase text-black no-underline"
            href={`/authors/${author?.name}`}
          >
            <div>
              <Image
                className="m-0 rounded-full"
                src="/images/no-avatar.png"
                width={24}
                height={24}
                alt={`Avatar of ${author?.name}`}
              />
            </div>
            <div className="underline">{author?.name}</div>
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
  );
};

export function StaticArticleView({ article, onlyContent }) {
  const seoMetadata = getSeoMetadata(article);

  return (
    <div className="px-8 lg:px-4">
      <ArticleHeader article={article} seoMetadata={seoMetadata} />
      <ArticleRenderer
        article={article}
        componentMap={componentOverrideMap}
        smartComponentMap={clientSmartComponentMap}
        __experimentalFlags={{
          disableAllStyles: !!onlyContent,
          preserveImageStyles: true,
          useUnintrusiveTitleRendering: true,
        }}
      />

      <div className="border-base-300 mt-16 flex w-full flex-wrap gap-x-3 gap-y-3 border-t-[1px] pt-9 lg:mt-32">
        {seoMetadata.keywords && Array.isArray(seoMetadata.keywords)
          ? seoMetadata.keywords.map((x, i) => (
              <div
                key={i}
                className="text-bold text-neutral-content inline-block rounded-full border border-[#D4D4D4] bg-[#F5F5F5] px-3 py-1 text-sm !no-underline"
              >
                {x}
              </div>
            ))
          : null}
      </div>
    </div>
  );
}

export default function ArticleView({ article, onlyContent, publishingLevel }) {
  const { data } = useArticle(
    article.id,
    {
      publishingLevel,
      contentType: "TREE_PANTHEON_V2",
    },
    {
      skip: publishingLevel !== "REALTIME",
    },
  );

  const hydratedArticle = data?.article ?? article;

  return (
    <StaticArticleView article={hydratedArticle} onlyContent={onlyContent} />
  );
}
