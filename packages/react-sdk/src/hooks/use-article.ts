import { type QueryHookOptions } from "@apollo/client";
import { useQuery } from "@apollo/client/react/hooks/useQuery.js";
import {
  ARTICLE_UPDATE_SUBSCRIPTION,
  ArticleQueryArgs,
  buildContentType,
  GET_ARTICLE_QUERY,
} from "@pantheon-systems/pcc-sdk-core";
import { Article } from "@pantheon-systems/pcc-sdk-core/types";
import { useEffect, useMemo } from "react";

type Return = ReturnType<typeof useQuery<{ article: Article }>> & {
  article: Article | undefined;
};

type ApolloQueryOptions = Omit<
  QueryHookOptions<{ article: Article }>,
  "variables"
>;

export const useArticle = (
  id: string,
  args?: ArticleQueryArgs,
  apolloQueryOptions?: ApolloQueryOptions,
): Return => {
  const publishingLevel = args?.publishingLevel;
  const contentType = buildContentType(args?.contentType);

  const memoizedArgs = useMemo(() => {
    return {
      ...(publishingLevel && { publishingLevel }),
      ...(contentType && { contentType }),
    };
  }, [publishingLevel, contentType]);

  const { subscribeToMore, ...queryData } = useQuery<{ article: Article }>(
    GET_ARTICLE_QUERY,
    {
      ...apolloQueryOptions,
      variables: { id, ...memoizedArgs },
    },
  );

  useEffect(() => {
    if (apolloQueryOptions?.skip) return;

    subscribeToMore({
      document: ARTICLE_UPDATE_SUBSCRIPTION,
      variables: { id, ...memoizedArgs },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;

        const { article } = subscriptionData.data;
        console.log("updateQuery", article.updatedAt);
        return { article, updatedAt: article.updatedAt };
      },
    });
  }, [id, memoizedArgs, subscribeToMore, apolloQueryOptions?.skip]);

  console.log({ queryData });

  return {
    ...queryData,
    subscribeToMore,
    article: queryData.data?.article,
  };
};
