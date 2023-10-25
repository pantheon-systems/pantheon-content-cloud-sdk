/**
 * Static helper functions for articles
 */

import { ApolloError } from "..";
import { PantheonClient } from "../core/pantheon-client";
import { GET_ARTICLE_QUERY, LIST_ARTICLES_QUERY } from "../lib/gql";
import {
  Article,
  ArticleWithoutContent,
  ContentType,
  PublishingLevel,
} from "../types";

export interface ArticleQueryArgs {
  contentType?: keyof typeof ContentType;
  publishingLevel?: keyof typeof PublishingLevel;
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

export async function getArticles(
  client: PantheonClient,
  args?: ArticleQueryArgs,
  searchParams?: ArticleSearchArgs,
) {
  const { contentType: requestedContentType, ...rest } = args || {};
  const contentType = buildContentType(requestedContentType);

  const articles = await client.apolloClient.query({
    query: LIST_ARTICLES_QUERY,
    variables: Object.assign(
      {},
      { contentType, ...rest },
      convertSearchParamsToGQL(searchParams),
    ),
  });

  return articles.data.articles as ArticleWithoutContent[];
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
