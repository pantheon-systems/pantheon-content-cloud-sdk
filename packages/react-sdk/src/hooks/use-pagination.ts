import { PCCConvenienceFunctions } from "@pantheon-systems/pcc-sdk-core";
import {
  ArticleWithoutContent,
  PaginatedArticle,
} from "@pantheon-systems/pcc-sdk-core/types";
import { useEffect, useState } from "react";

interface Props {
  cursor: number;
  pageSize: number;
  initialArticles: PaginatedArticle[] | ArticleWithoutContent[];
}

export function usePagination({ cursor, initialArticles, pageSize }: Props) {
  const [currentCursor, setCurrentCursor] = useState(cursor);
  const [articlePages, setArticlePages] = useState([initialArticles]);
  const [fetching, setFetching] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    (async () => {
      if (articlePages[currentPage]) return;

      setFetching(true);
      const { data, cursor: newCursor } =
        await PCCConvenienceFunctions.getPaginatedArticles({
          cursor: currentCursor,
          pageSize,
        });
      setFetching(false);
      setArticlePages((prev) => [...prev, data]);
      setCurrentCursor(newCursor);
    })();
  }, [currentPage, articlePages, currentCursor]);

  return {
    // Return last page if current page doesn't exist
    data: articlePages[currentPage] || articlePages[articlePages.length - 1],
    fetching,
    onPageChange: setCurrentPage,
    currentPage,
  };
}
