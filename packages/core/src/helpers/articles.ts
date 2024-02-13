/**
 * Static helper functions for articles
 */

import { ApolloError } from "..";
import { PantheonClient } from "../core/pantheon-client";
import {
  GET_ARTICLE_QUERY,
  LIST_ARTICLES_QUERY,
  LIST_ARTICLES_QUERY_W_CONTENT,
} from "../lib/gql";
import {
  Article,
  ArticleSortField,
  ArticleWithoutContent,
  ContentType,
  PaginatedArticle,
  PublishingLevel,
  SortOrder,
} from "../types";

export interface ArticleQueryArgs {
  contentType?: keyof typeof ContentType;
  publishingLevel?: keyof typeof PublishingLevel;
  sortBy?: keyof typeof ArticleSortField;
  sortOrder?: keyof typeof SortOrder;
}

export interface ArticlePaginatedQueryArgs {
  contentType?: keyof typeof ContentType;
  publishingLevel?: keyof typeof PublishingLevel;
  sortBy?: keyof typeof ArticleSortField;
  sortOrder?: keyof typeof SortOrder;
  pageSize?: number;
  cursor?: number;
}

type FilterableFields = "body" | "tag" | "title";

type PublishStatus = "published" | "unpublished";

export type ArticleSearchArgs = {
  bodyContains?: string;
  tagContains?: string;
  titleContains?: string;
  publishStatus?: PublishStatus;
};

type ConvertedArticleSearchArgs = {
  [key in FilterableFields]: { contains: string } | undefined;
} & {
  publishStatus?: PublishStatus;
};

export function convertSearchParamsToGQL(
  searchParams?: ArticleSearchArgs,
): { filter: ConvertedArticleSearchArgs } | null {
  if (!searchParams) return null;

  const convertedObject: ConvertedArticleSearchArgs = {
    body: searchParams.bodyContains
      ? {
          contains: searchParams.bodyContains,
        }
      : undefined,
    tag: searchParams.tagContains
      ? {
          contains: searchParams.tagContains,
        }
      : undefined,
    title: searchParams.titleContains
      ? {
          contains: searchParams.titleContains,
        }
      : undefined,
    publishStatus: searchParams.publishStatus,
  };

  return Object.keys(convertedObject).length
    ? { filter: convertedObject }
    : null;
}

function fetchEmptyPage(total: number): () => Promise<PaginatedArticle> {
  return async () => ({
    data: [],
    totalCount: total,
    fetchNextPage: fetchEmptyPage(total),
  });
}
export async function getPaginatedArticles(
  client: PantheonClient,
  args?: ArticlePaginatedQueryArgs,
  searchParams?: ArticleSearchArgs,
  includeContent?: boolean,
): Promise<PaginatedArticle> {
  const { contentType: requestedContentType, ...rest } = args || {};
  const contentType = buildContentType(requestedContentType);

  const response = await client.apolloClient.query({
    query: includeContent ? LIST_ARTICLES_QUERY_W_CONTENT : LIST_ARTICLES_QUERY,
    variables: {
      ...rest,
      ...convertSearchParamsToGQL(searchParams),
      contentType,
    },
  });
  const articles = response.data.articles as ArticleWithoutContent[];
  const { total, cursor } = response.data.extensions?.pagination || {};

  return {
    data: articles,
    totalCount: total,
    fetchNextPage:
      cursor && articles.length > 0
        ? () =>
            getPaginatedArticles(
              client,
              { ...args, cursor },
              searchParams,
              includeContent,
            )
        : fetchEmptyPage(total),
  };
}

export async function getArticles(
  client: PantheonClient,
  args?: ArticleQueryArgs,
  searchParams?: ArticleSearchArgs,
  includeContent?: boolean,
) {
  const { contentType: requestedContentType, ...rest } = args || {};
  const contentType = buildContentType(requestedContentType);

  const response = await client.apolloClient.query({
    query: includeContent ? LIST_ARTICLES_QUERY_W_CONTENT : LIST_ARTICLES_QUERY,
    variables: {
      ...rest,
      ...convertSearchParamsToGQL(searchParams),
      contentType,
      pageSize: 50,
    },
  });

  return response.data.articles as ArticleWithoutContent[];
}

export async function getArticle(
  client: PantheonClient,
  id: number | string,
  args?: ArticleQueryArgs,
) {
  const { contentType: requestedContentType, ...rest } = args || {};
  const contentType = buildContentType(requestedContentType);

  const article = await client.apolloClient.query({
    query: GET_ARTICLE_QUERY,
    variables: { id: id.toString(), contentType, ...rest },
  });

  return article.data.article as Article;
}

export async function getArticleBySlug(
  client: PantheonClient,
  slug: string,
  args?: ArticleQueryArgs,
) {
  const { contentType: requestedContentType, ...rest } = args || {};
  const contentType = buildContentType(requestedContentType);

  const article = await client.apolloClient.query({
    query: GET_ARTICLE_QUERY,
    variables: { slug, contentType, ...rest },
  });

  return article.data.article as Article;
}

export async function getArticleBySlugOrId(
  client: PantheonClient,
  slugOrId: number | string,
  args?: ArticleQueryArgs,
) {
  // First attempt to retrieve by slug, and fallback to by id if the matching slug
  // couldn't be found.
  try {
    const article = await getArticleBySlug(client, slugOrId.toString(), args);

    if (article) {
      return article;
    }
    // eslint-disable-next-line no-empty
  } catch (e) {
    if (
      !(e instanceof ApolloError) ||
      (e instanceof ApolloError &&
        e.graphQLErrors[0]?.message !==
          "No document matching this slug was found.")
    ) {
      console.error(e);
    }
  }

  try {
    return await getArticle(client, slugOrId, args);
  } catch (e) {
    if (
      !(e instanceof ApolloError) ||
      (e instanceof ApolloError &&
        e.graphQLErrors[0]?.message !==
          "No document matching this ID was found.")
    ) {
      console.error(e);
    }

    return null;
  }
}

export function buildContentType(contentType?: keyof typeof ContentType) {
  if (
    !contentType ||
    contentType === ContentType.TREE_PANTHEON_V2 ||
    contentType === ContentType.TREE_PANTHEON
  ) {
    // Ask for the latest version of the tree
    return ContentType.TREE_PANTHEON_V2;
  }

  return contentType;
}
