import { ref, watch } from "vue";

export default async function usePagination({
  initialArticles,
  pageSize,
  cursor,
}) {
  const currentCursor = ref(cursor);
  const articlePages = ref(initialArticles ? [initialArticles] : []);
  const currentPage = ref(0);
  const totalCount = ref(0);

  const {
    data,
    error,
    pending = false,
  } = await useAsyncData(
    "paginatedArticles",
    async () => {
      // No need to fetch since, we already have cached data inside `articlePages`
      if (articlePages.value[currentPage.value]) return {};

      return $fetch(`/api/articles/`, {
        params: {
          pageSize,
          cursor: currentCursor.value,
        },
      });
    },
    {
      watch: [currentPage],
    },
  );

  function onPageChange(page) {
    currentPage.value = page;
  }

  watch(
    [data],
    async () => {
      if (Object.keys(data.value).length === 0) return;

      const {
        totalCount: _totalCount,
        data: newArticles,
        cursor: newCursor,
      } = data.value;
      totalCount.value = _totalCount;
      articlePages.value = [...articlePages.value, newArticles];
      currentCursor.value = newCursor;
    },
    { immediate: true },
  );

  return {
    totalCount,
    articlePages,
    currentCursor,
    currentPage,
    fetching: pending,
    onPageChange,
    error,
  };
}
