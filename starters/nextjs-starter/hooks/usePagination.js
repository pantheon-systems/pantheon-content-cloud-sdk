import { useCallback, useEffect, useState } from "react";
import useSWR from "swr";

export function usePagination({ cursor, initialArticles, pageSize }) {
  const [articlePages, setArticlePages] = useState(
    initialArticles ? [initialArticles] : [],
  );
  const [currentPage, setCurrentPage] = useState(0);
  const [currentCursor, setCurrentCursor] = useState(cursor);

  const fetcher = useCallback(
    async (key) => {
      const pageNumber = Number(key);
      if (articlePages[pageNumber]) return null;

      const response = await fetch(
        `/api/utils/paginate?pageSize=${pageSize}&cursor=${currentCursor}`,
      );
      return await response.json();
    },
    [currentCursor, pageSize, articlePages],
  );

  const { data: newResponse, isLoading } = useSWR(
    !articlePages[currentPage] ? currentPage.toString() : null,
    fetcher,
  );

  useEffect(() => {
    if (!newResponse) return;

    const { data, newCursor } = newResponse;
    setArticlePages((prev) => {
      if (prev[currentPage]) return prev;

      const result = [...prev];
      result[currentPage] = data;
      return result;
    });
    setCurrentCursor(newCursor);
  }, [newResponse, currentPage]);

  return {
    // Return last page if current page doesn't exist
    data: articlePages[currentPage] || articlePages[articlePages.length - 1],
    fetching: isLoading,
    onPageChange: setCurrentPage,
    currentPage,
  };
}
