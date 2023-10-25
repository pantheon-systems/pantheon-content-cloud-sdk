import { useQuery } from "@apollo/client/react/hooks/useQuery.js";
import {
  ArticleQueryArgs,
  ArticleSearchArgs,
  buildContentType,
  convertSearchParamsToGQL,
  LIST_ARTICLES_QUERY,
} from "@pantheon-systems/pcc-sdk-core";
import { ArticleWithoutContent } from "@pantheon-systems/pcc-sdk-core/types";

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
  const contentType = buildContentType(args?.contentType);
  const queryData = useQuery<ListArticlesResponse>(LIST_ARTICLES_QUERY, {
    variables: Object.assign(
      {},
      { ...args, contentType },
      convertSearchParamsToGQL(searchParams),
    ),
  });

  return {
    ...queryData,
    articles: queryData.data?.articles,
  };
};
