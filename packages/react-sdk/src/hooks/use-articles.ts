import { useQuery } from "@apollo/client/react/hooks/useQuery.js";
import {
  ArticleQueryArgs,
  ArticleSearchArgs,
  convertSearchParamsToGQL,
  LIST_ARTICLES_QUERY,
} from "@pantheon-systems/pcc-sdk-core";
import { ArticleWithoutContent } from "../types";

type ListArticlesResponse = {
  articles: ArticleWithoutContent[];
};

type Return = ReturnType<typeof useQuery<ListArticlesResponse>> & {
  articles: ArticleWithoutContent[] | undefined;
};

export const useArticles = (
  args?: ArticleQueryArgs,
  searchParams?: ArticleSearchArgs,
): Return => {
  const queryData = useQuery<ListArticlesResponse>(LIST_ARTICLES_QUERY, {
    variables: Object.assign({}, args, convertSearchParamsToGQL(searchParams)),
  });

  return {
    ...queryData,
    articles: queryData.data?.articles,
  };
};
