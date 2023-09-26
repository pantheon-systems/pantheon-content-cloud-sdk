import { useQuery } from "@apollo/client/react/hooks/useQuery.js";
import {
  ARTICLE_UPDATE_SUBSCRIPTION,
  ArticleQueryArgs,
  GET_ARTICLE_QUERY,
} from "@pantheon-systems/pcc-sdk-core";
import { Article } from "@pantheon-systems/pcc-sdk-core/types";
import { useEffect, useMemo } from "react";

type Return = ReturnType<typeof useQuery<{ article: Article }>> & {
  article: Article | undefined;
};

export const useArticle = (id: string, args?: ArticleQueryArgs): Return => {
  const publishingLevel = args?.publishingLevel;
  const contentType = args?.contentType;

  const memoizedArgs = useMemo(() => {
    return {
      ...(publishingLevel && { publishingLevel }),
      ...(contentType && { contentType }),
    };
  }, [publishingLevel, contentType]);

  const { subscribeToMore, ...queryData } = useQuery<{ article: Article }>(
    GET_ARTICLE_QUERY,
    {
      variables: { id, ...memoizedArgs },
    },
  );

  useEffect(() => {
    subscribeToMore({
      document: ARTICLE_UPDATE_SUBSCRIPTION,
      variables: { id, ...memoizedArgs },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;

        const { article } = subscriptionData.data;
        return { article };
      },
    });
  }, [id, memoizedArgs, subscribeToMore]);

  return {
    ...queryData,
    subscribeToMore,
    article: queryData.data?.article,
  };
};
