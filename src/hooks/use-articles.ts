import { gql, useQuery } from '@apollo/client';
import { Article } from '../types';

const LIST_ARTICLES_QUERY = gql`
  query ListArticles {
    articles {
      id
      title
      source
      sourceURL
      keywords
      publishedDate
    }
  }
`;

type ListArticlesResponse = {
  articles: Omit<Article, 'content'>[];
};

export const useArticles = () => {
  const queryData = useQuery<ListArticlesResponse>(LIST_ARTICLES_QUERY);

  return {
    ...queryData,
    articles: queryData.data?.articles,
  };
};
