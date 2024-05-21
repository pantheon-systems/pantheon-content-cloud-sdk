/**
 * Static helper functions for articles
 */

import { ApolloError } from "..";
import { PantheonClient } from "../core/pantheon-client";
import {
  generateListArticlesGQL,
  GET_ARTICLE_QUERY,
  GET_RECOMMENDED_ARTICLES_QUERY,
  LIST_PAGINATED_ARTICLES_QUERY,
  LIST_PAGINATED_ARTICLES_QUERY_W_CONTENT,
} from "../lib/gql";
import {
  Article,
  ArticleSortField,
  ArticleV2Response,
  ArticleWithoutContent,
  ContentType,
  PaginatedArticle,
  PublishingLevel,
  SortOrder,
} from "../types";
import { handleApolloError } from "./errors";

export interface ArticleQueryArgs {
  contentType?: keyof typeof ContentType;
  publishingLevel?: keyof typeof PublishingLevel;
  sortBy?: keyof typeof ArticleSortField;
  sortOrder?: keyof typeof SortOrder;
  metadataFilters?: { [key: string]: unknown };
}

export interface ArticlePaginatedQueryArgs {
  contentType?: keyof typeof ContentType;
  publishingLevel?: keyof typeof PublishingLevel;
  sortBy?: keyof typeof ArticleSortField;
  sortOrder?: keyof typeof SortOrder;
  metadataFilters?: { [key: string]: unknown };
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

function fetchEmptyPage(
  total: number,
  cursor: number,
): () => Promise<PaginatedArticle> {
  return async () => ({
    data: [],
    totalCount: total,
    cursor,
    fetchNextPage: fetchEmptyPage(total, cursor),
  });
}
export async function getPaginatedArticles(
  client: PantheonClient,
  args?: ArticlePaginatedQueryArgs,
  searchParams?: ArticleSearchArgs,
  includeContent?: boolean,
): Promise<PaginatedArticle> {
  try {
    const {
      contentType: requestedContentType,
      metadataFilters,
      ...rest
    } = args || {};
    const contentType = buildContentType(requestedContentType);

    const response = await client.apolloClient.query({
      query: includeContent
        ? LIST_PAGINATED_ARTICLES_QUERY_W_CONTENT
        : LIST_PAGINATED_ARTICLES_QUERY,
      variables: {
        ...rest,
        ...(metadataFilters && {
          metadataFilters: JSON.stringify(metadataFilters),
        }),
        ...convertSearchParamsToGQL(searchParams),
        contentType,
      },
    });
    const articles = response.data.articles as ArticleWithoutContent[];
    const { total, cursor } = response.data.extensions?.pagination || {};

    return {
      data: articles,
      totalCount: total,
      cursor,
      fetchNextPage:
        cursor && articles.length > 0
          ? () =>
              getPaginatedArticles(
                client,
                { ...args, cursor },
                searchParams,
                includeContent,
              )
          : fetchEmptyPage(total, cursor),
    };
  } catch (e) {
    handleApolloError(e);
  }
}

export async function getArticles(
  client: PantheonClient,
  args?: ArticleQueryArgs,
  searchParams?: ArticleSearchArgs,
  withContent?: boolean,
): Promise<ArticleWithoutContent[]> {
  return (
    await getArticlesWithSummary(client, args, searchParams, withContent, false)
  ).articles;
}

export async function getArticlesWithSummary(
  client: PantheonClient,
  args?: ArticleQueryArgs,
  searchParams?: ArticleSearchArgs,
  withContent?: boolean,
  withSummary?: boolean,
): Promise<ArticleV2Response> {
  try {
    const {
      contentType: requestedContentType,
      metadataFilters,
      ...rest
    } = args || {};
    const contentType = buildContentType(requestedContentType);

    const query = generateListArticlesGQL({
      withContent,
      withSummary,
    });

    const response = await client.apolloClient.query({
      query,
      variables: {
        ...rest,
        ...convertSearchParamsToGQL(searchParams),
        ...(metadataFilters && {
          metadataFilters: JSON.stringify(metadataFilters),
        }),
        contentType,
      },
    });

    return response.data.articlesv2;
  } catch (e) {
    handleApolloError(e);
  }
}

export async function getArticle(
  client: PantheonClient,
  id: number | string,
  args?: ArticleQueryArgs,
) {
  const {
    contentType: requestedContentType,
    metadataFilters,
    ...rest
  } = args || {};
  const contentType = buildContentType(requestedContentType);

  const article = await client.apolloClient.query({
    query: GET_ARTICLE_QUERY,
    variables: {
      id: id.toString(),
      contentType,
      ...rest,
      ...(metadataFilters && {
        metadataFilters: JSON.stringify(metadataFilters),
      }),
    },
  });

  return article.data.article as Article;
}

export async function getArticleBySlug(
  client: PantheonClient,
  slug: string,
  args?: ArticleQueryArgs,
) {
  const {
    contentType: requestedContentType,
    metadataFilters,
    ...rest
  } = args || {};
  const contentType = buildContentType(requestedContentType);

  const article = await client.apolloClient.query({
    query: GET_ARTICLE_QUERY,
    variables: {
      slug,
      contentType,
      ...rest,
      ...(metadataFilters && {
        metadataFilters: JSON.stringify(metadataFilters),
      }),
    },
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
    // Ignore any errors with retrieving by slug, because next we will try
    // to retrieve by id.
  }

  try {
    const article = await getArticle(client, slugOrId, args);
    return article;
  } catch (e) {
    if (
      !(e instanceof ApolloError) ||
      (e instanceof ApolloError &&
        e.message !== "No document matching this slug was found." &&
        e.message !== "No document matching this ID was found." &&
        e.graphQLErrors[0]?.message !==
          "No document matching this ID was found." &&
        e.graphQLErrors[0]?.message !==
          "No document matching this slug was found.")
    ) {
      handleApolloError(e);
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

export async function getRecommendedArticles(
  client: PantheonClient,
  id: number | string,
) {
  try {
    const article = await client.apolloClient.query({
      query: GET_RECOMMENDED_ARTICLES_QUERY,
      variables: { id: id.toString() },
    });

    return article.data.recommendedArticles as Article[];
  } catch (e) {
    handleApolloError(e);
  }
}
