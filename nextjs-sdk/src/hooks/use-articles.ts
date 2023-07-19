import { useQuery } from '../lib/apollo-client';
import {
  ArticleQueryArgs,
  ArticleSearchArgs,
  LIST_ARTICLES_QUERY,
  convertSearchParamsToGQL,
} from '../lib/articles';
import { ArticleWithoutContent } from '../types';

type ListArticlesResponse = {
  articles: ArticleWithoutContent[];
};

export const useArticles = (
  args?: ArticleQueryArgs,
  searchParams?: ArticleSearchArgs,
) => {
  const queryData = useQuery<ListArticlesResponse>(LIST_ARTICLES_QUERY, {
    variables: { ...args, ...convertSearchParamsToGQL(searchParams) },
  });

  return {
    ...queryData,
    articles: queryData.data?.articles,
  };
};
