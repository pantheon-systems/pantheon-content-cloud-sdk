import { type ArticleWithoutContent } from "@pantheon-systems/pcc-vue-sdk";
import { ref, watch } from "vue";

interface Props {
  pageSize: number;
  initialArticles?: ArticleWithoutContent[];
  cursor?: number;
}

export default function usePagination({
  initialArticles,
  pageSize,
  cursor,
}: Props) {
  const currentCursor = ref(cursor);
  const articlePages = ref(initialArticles ? [initialArticles] : []);
  const fetching = ref(false);
  const currentPage = ref(0);
  const totalCount = ref(0);
  const error = ref();

  function onPageChange(page: number) {
    currentPage.value = page;
  }

  watch(
    [currentPage],
    async () => {
      if (articlePages.value[currentPage.value]) return;

      fetching.value = true;
      try {
        const {
          totalCount: _totalCount,
          data: newArticles,
          cursor: newCursor,
        } = await $fetch(`/api/articles/`, {
          params: {
            pageSize,
            cursor: currentCursor.value,
          },
        });
        totalCount.value = _totalCount;
        articlePages.value = [...articlePages.value, newArticles];
        currentCursor.value = newCursor;
        fetching.value = false;
      } catch (err) {
        error.value = err;
      }
    },
    { immediate: true },
  );

  return {
    totalCount,
    articlePages,
    currentCursor,
    currentPage,
    fetching,
    onPageChange,
    error,
  };
}
