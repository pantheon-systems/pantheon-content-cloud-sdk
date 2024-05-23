"use client";

import { ArticleWithoutContent } from "@pantheon-systems/pcc-react-sdk";
import { useSetAtom } from "jotai";
import { useEffect } from "react";
import { PostGrid } from "../../components/grid";
import { searchQueryAtom } from "../../components/searchbar";

interface Props {
  articles: ArticleWithoutContent[];
  searchString: string;
}

export default function TagResults({ articles, searchString }: Props) {
  const setSearchQuery = useSetAtom(searchQueryAtom);

  useEffect(() => {
    setSearchQuery(searchString);
    // Don't include searchString as a hook dependency because we only
    // want to update it when this component initially mounts.
  }, [setSearchQuery]); // eslint-disable-line react-hooks/exhaustive-deps

  return searchString.trim().length ? (
    <>
      {" "}
      <h3 className="mt-4 text-3xl text-center">
        Article with tag &quot;{searchString}&quot;
      </h3>
      <section>
        <PostGrid data={articles} />
      </section>
    </>
  ) : null;
}
