import {
  ArticleQueryArgs,
  buildContentType,
  GET_ARTICLE_QUERY,
} from "@pantheon-systems/pcc-sdk-core";
import { Article } from "@pantheon-systems/pcc-sdk-core/types";
import { useQuery } from "@vue/apollo-composable";

type GetArticleQueryResult = {
  article: Article;
};

type Return = ReturnType<typeof useQuery<GetArticleQueryResult>> & {
  article: Article | undefined;
};

export const useArticle = (id: string, args?: ArticleQueryArgs): Return => {
  const contentType = buildContentType(args?.contentType);
  const { subscribeToMore, ...queryData } = useQuery<GetArticleQueryResult>(
    GET_ARTICLE_QUERY,
    {
      id,
      ...args,
      contentType,
    },
  );

  subscribeToMore({
    document: GET_ARTICLE_QUERY,
    variables: { id, ...args },
    updateQuery: (prev, { subscriptionData }) => {
      if (!subscriptionData.data) return prev;

      const { article } = subscriptionData.data;
      return { article };
    },
  });

  return {
    ...queryData,
    subscribeToMore,
    article: queryData.result?.value?.article,
  };
};
