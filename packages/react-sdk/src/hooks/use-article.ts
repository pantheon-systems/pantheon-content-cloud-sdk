import { type QueryHookOptions } from "@apollo/client";
import { useQuery } from "@apollo/client/react/hooks/useQuery.js";
import { useSubscription } from "@apollo/client/react/hooks/useSubscription.js";
import {
  ArticleQueryArgs,
  buildContentType,
  generateArticleQuery,
  generateArticleUpdateSubscription,
} from "@pantheon-systems/pcc-sdk-core";
import { Article } from "@pantheon-systems/pcc-sdk-core/types";
import { useMemo } from "react";

type Return = ReturnType<typeof useQuery<{ article: Article }>> & {
  article: Article | undefined;
  subscriptionResult: ReturnType<typeof useSubscription<{ article: Article }>>;
};

type ApolloQueryOptions = Omit<
  QueryHookOptions<{ article: Article }>,
  "variables"
>;

export const useArticle = (
  id: string,
  args?: ArticleQueryArgs,
  apolloQueryOptions?: ApolloQueryOptions,
  related?: {
    site?: boolean;
  },
): Return => {
  const publishingLevel = args?.publishingLevel;
  const contentType = buildContentType(args?.contentType);
  const versionId = args?.versionId;

  const memoizedArgs = useMemo(() => {
    return {
      ...(publishingLevel && { publishingLevel }),
      ...(contentType && { contentType }),
      ...(versionId && { versionId }),
    };
  }, [publishingLevel, contentType, versionId]);

  const queryDocument = useMemo(
    () => generateArticleQuery({ withSite: related?.site }),
    [related?.site],
  );

  const subscriptionDocument = useMemo(
    () => generateArticleUpdateSubscription({ withSite: related?.site }),
    [related?.site],
  );

  const variables = useMemo(
    () => ({ id, ...memoizedArgs }),
    [id, memoizedArgs],
  );

  const queryResult = useQuery<{ article: Article }>(queryDocument, {
    ...apolloQueryOptions,
    variables,
  });

  const subscriptionResult = useSubscription<{ article: Article }>(
    subscriptionDocument,
    {
      variables,
      skip: !!apolloQueryOptions?.skip,
      onData: ({ client, data }) => {
        if (!data?.data) return;
        const incoming = data.data.article as Article;

        client.cache.updateQuery<{ article: Article }>(
          {
            query: queryDocument,
            variables,
          },
          () => {
            return { article: incoming };
          },
        );
      },
    },
  );

  return {
    ...queryResult,
    article: queryResult.data?.article,
    subscriptionResult,
  };
};
