import { useQuery } from '../lib/apollo-client';
import { ArticleQueryArgs, LIST_ARTICLES_QUERY } from '../lib/articles';
import { ArticleWithoutContent } from '../types';

type ListArticlesResponse = {
  articles: ArticleWithoutContent[];
};

export const useArticles = (args?: ArticleQueryArgs) => {
  const queryData = useQuery<ListArticlesResponse>(LIST_ARTICLES_QUERY, {
    variables: args,
  });

  return {
    ...queryData,
    articles: queryData.data?.articles,
  };
};
