import { useEffect, useState } from "react";

export function usePagination({ cursor, initialArticles, pageSize }) {
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
        "/api/utils/paginate/?" +
          new URLSearchParams({
            pageSize: pageSize.toString(),
            cursor: currentCursor,
          }).toString(),
      );
      const { data, newCursor } = await response.json();
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
