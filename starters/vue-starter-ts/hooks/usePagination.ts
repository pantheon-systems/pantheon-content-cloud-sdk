import { type ArticleWithoutContent } from "@pantheon-systems/pcc-vue-sdk";
import { ref, watch } from "vue";

interface Props {
  pageSize: number;
  initialArticles?: ArticleWithoutContent[];
  cursor?: number;
}

export default async function usePagination({
  initialArticles,
  pageSize,
  cursor,
}: Props) {
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

  function onPageChange(page: number) {
    currentPage.value = page;
  }

  watch(
    [data],
    async () => {
      if (!data.value || Object.keys(data.value).length === 0) return;

      const {
        totalCount: _totalCount,
        data: newArticles,
        cursor: newCursor,
      } = data.value as {
        totalCount: number;
        data: ArticleWithoutContent[];
        cursor: number;
      };
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
