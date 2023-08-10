import {
  ArticleQueryArgs,
  LIST_ARTICLES_QUERY,
} from "@pantheon-systems/pcc-sdk-core";
import { ArticleWithoutContent } from "@pantheon-systems/pcc-sdk-core/types";
import { useQuery } from "@vue/apollo-composable";

type ListArticlesResponse = {
  articles: ArticleWithoutContent[];
};

type Return = ReturnType<typeof useQuery<ListArticlesResponse>> & {
  articles: ArticleWithoutContent[] | undefined;
};

export const useArticles = (args?: ArticleQueryArgs): Return => {
  const queryData = useQuery<ListArticlesResponse>(LIST_ARTICLES_QUERY, {
    variables: args,
  });

  return {
    ...queryData,
    articles: queryData.result?.value?.articles,
  };
};
