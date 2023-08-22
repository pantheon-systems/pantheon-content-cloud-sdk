import { useQuery } from "@apollo/client/react/hooks/useQuery.js";
import {
  ARTICLE_UPDATE_SUBSCRIPTION,
  ArticleQueryArgs,
  GET_ARTICLE_QUERY,
} from "@pantheon-systems/pcc-sdk-core";
import { Article } from "@pantheon-systems/pcc-sdk-core/types";
import { useEffect } from "react";

type Return = ReturnType<typeof useQuery<{ article: Article }>> & {
  article: Article | undefined;
};

export const useArticle = (id: string, args?: ArticleQueryArgs): Return => {
  const { subscribeToMore, ...queryData } = useQuery<{ article: Article }>(
    GET_ARTICLE_QUERY,
    {
      variables: { id, ...args },
    },
  );

  useEffect(() => {
    subscribeToMore({
      document: ARTICLE_UPDATE_SUBSCRIPTION,
      variables: { id, ...args },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;

        const { article } = subscriptionData.data;
        return { article };
      },
    });
  }, [subscribeToMore]);

  return {
    ...queryData,
    subscribeToMore,
    article: queryData.data?.article,
  };
};
