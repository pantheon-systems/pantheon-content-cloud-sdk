import { useQuery } from '../lib/apollo-client';
import { LIST_ARTICLES_QUERY } from '../lib/articles';
import { ArticleWithoutContent } from '../types';

type ListArticlesResponse = {
  articles: ArticleWithoutContent[];
};

export const useArticles = () => {
  const queryData = useQuery<ListArticlesResponse>(LIST_ARTICLES_QUERY);

  return {
    ...queryData,
    articles: queryData.data?.articles,
  };
};
