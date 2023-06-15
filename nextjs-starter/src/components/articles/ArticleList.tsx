import Link from "next/link";
import React, { Fragment, useMemo } from "react";

import { ArticleWithoutContent } from "@pcc/react";

interface Props {
  articles: ArticleWithoutContent[];
}

export default function ArticleList({ articles }: Props) {
  const validArticles = useMemo(
    () => articles?.filter((article) => Boolean(article.title)),
    [articles]
  );

  return (
    <div>
      <h2 className="mb-8 text-2xl font-bold">Articles</h2>

      {validArticles.map((article) => (
        <Fragment key={article.id}>
          <div>
            <Link
              href={`/${article.id}`}
              className="text-lg leading-[1.75rem] font-medium underline underline-offset-4 hover:no-underline"
            >
              <h3>{article.title}</h3>
            </Link>
            <p className="mt-2 text-sm leading-[1.25rem] text-theme-bg-black">
              Description of the article
            </p>

            <p className="mt-2 text-sm leading-[1.25rem] text-theme-bg-black">
              {article.keywords?.join(", ")}
            </p>
            <p className="mt-2 text-sm leading-[1.25rem] text-theme-bg-black">
              {new Date(
                article?.publishedDate || "2023-01-01"
              ).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          <hr className="my-8" />
        </Fragment>
      ))}
    </div>
  );
}
