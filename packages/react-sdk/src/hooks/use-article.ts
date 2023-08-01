import { useEffect } from "react";
import { useQuery } from "../lib/apollo-client";
import {
  ARTICLE_UPDATE_SUBSCRIPTION,
  ArticleQueryArgs,
  GET_ARTICLE_QUERY,
} from "../lib/articles";
import { Article } from "../types";

export const useArticle = (id: string, args?: ArticleQueryArgs) => {
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
  }, []);

  return {
    ...queryData,
    article: queryData.data?.article,
  };
};
