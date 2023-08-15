/**
 * Static helper functions for articles
 */

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
export type ArticleSearchArgs = { [key in FilterableFields]: string };
type ConvertedArticleSearchArgs = {
  [key in FilterableFields]: { contains: string };
};

export function convertSearchParamsToGQL(
  searchParams?: ArticleSearchArgs,
): { filter: ConvertedArticleSearchArgs } | null {
  if (!searchParams) return null;

  // Cast empty object to workaround Typescript bug
  // https://stackoverflow.com/questions/15877362/declare-and-initialize-a-dictionary-in-typescript
  const convertedObject: ConvertedArticleSearchArgs =
    {} as ConvertedArticleSearchArgs;

  Object.keys(searchParams).forEach(
    (k) =>
      (convertedObject[k.replace("Contains", "") as FilterableFields] = {
        contains: searchParams[k as FilterableFields],
      }),
  );

  return Object.keys(convertedObject).length
    ? { filter: convertedObject }
    : null;
}

export async function getArticles(
  client: PantheonClient,
  args?: ArticleQueryArgs,
  searchParams?: ArticleSearchArgs,
) {
  const articles = await client.apolloClient.query({
    query: LIST_ARTICLES_QUERY,
    variables: Object.assign({}, args, convertSearchParamsToGQL(searchParams)),
  });

  return articles.data.articles as ArticleWithoutContent[];
}

export async function getArticle(
  client: PantheonClient,
  id: string,
  args?: ArticleQueryArgs,
) {
  const article = await client.apolloClient.query({
    query: GET_ARTICLE_QUERY,
    variables: { id, ...args },
  });

  return article.data.article as Article;
}

export async function getArticleBySlug(
  client: PantheonClient,
  slug: string,
  args?: ArticleQueryArgs,
) {
  const article = await client.apolloClient.query({
    query: GET_ARTICLE_QUERY,
    variables: { slug, ...args },
  });

  return article.data.article as Article;
}

export async function getArticleBySlugOrId(
  client: PantheonClient,
  slugOrId: string,
  args?: ArticleQueryArgs,
) {
  // First attempt to retrieve by slug, and fallback to by id if the matching slug
  // couldn't be found.
  try {
    const article = await getArticleBySlug(client, slugOrId, args);

    if (article) {
      return article;
    }
    // eslint-disable-next-line no-empty
  } catch (e) {}

  return await getArticle(client, slugOrId, args);
}
