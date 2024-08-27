import {
  ArticleWithoutContent,
  PaginatedArticle,
} from "@pantheon-systems/pcc-sdk-core/types";
import { useEffect, useState } from "react";

interface Props {
  cursor?: string;
  pageSize: number;
  initialArticles?: PaginatedArticle[] | ArticleWithoutContent[];
}

export function usePagination({ cursor, initialArticles, pageSize }: Props) {
  const [currentCursor, setCurrentCursor] = useState(cursor);
  const [articlePages, setArticlePages] = useState(
    initialArticles ? [initialArticles] : [],
  );
  const [fetching, setFetching] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    (async () => {
      if (articlePages[currentPage]) return;

      setFetching(true);
      const response = await fetch(
        "/api/utils/paginate?" +
          new URLSearchParams({
            pageSize: pageSize.toString(),
            cursor: currentCursor || "",
          }).toString(),
      );
      const { data, newCursor } = (await response.json()) as {
        data: PaginatedArticle[];
        newCursor: string;
      };
      setFetching(false);
      setArticlePages((prev) => {
        const result = [...prev];
        result[currentPage] = data;
        return result;
      });
      setCurrentCursor(newCursor);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  return {
    // Return last page if current page doesn't exist
    data: articlePages[currentPage] || articlePages[articlePages.length - 1],
    fetching,
    onPageChange: setCurrentPage,
    currentPage,
  };
}
