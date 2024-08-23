"use client";

import { ArticleWithoutContent } from "@pantheon-systems/pcc-react-sdk";
import { useSetAtom } from "jotai";
import { useEffect } from "react";
import { ArticleGrid } from "../../components/grid";

interface Props {
  articles: ArticleWithoutContent[];
  searchString: string;
}

export default function SearchResults({ articles, searchString }: Props) {
  return searchString.trim().length ? (
    <>
      {" "}
      <h3 className="mt-4 text-center text-3xl">
        Search results for &quot;{searchString}&quot;
      </h3>
      <section>
        <ArticleGrid articles={articles} />
      </section>
    </>
  ) : null;
}
