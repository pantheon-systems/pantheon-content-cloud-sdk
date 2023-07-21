/**
 * Static helper functions for articles
 */

import { PantheonClient } from '../../core/pantheon-client';
import {
  Article,
  ArticleWithoutContent,
  ContentType,
  PublishingLevel,
} from '../../types';
import { gql } from '../apollo-client';

export interface ArticleQueryArgs {
  contentType?: keyof typeof ContentType;
  publishingLevel?: keyof typeof PublishingLevel;
}

type FilterableFields = 'body' | 'tag' | 'title';
export type ArticleSearchArgs = { [key in FilterableFields]: string };
type ConvertedArticleSearchArgs = {
  [key in FilterableFields]: { contains: string };
};

export const LIST_ARTICLES_QUERY = gql`
  query ListArticles(
    $contentType: ContentType
    $publishingLevel: PublishingLevel
    $filter: ArticleFilterInput
  ) {
    articles(
      contentType: $contentType
      publishingLevel: $publishingLevel
      filter: $filter
    ) {
      id
      title
      source
      sourceURL
      tags
      publishedDate
      publishingLevel
      contentType
    }
  }
`;

export function convertSearchParamsToGQL(
  searchParams?: ArticleSearchArgs,
): { filter: ConvertedArticleSearchArgs } | null {
  if (!searchParams) return null;

  // Cast empty object to workaround Typescript bug
  // https://stackoverflow.com/questions/15877362/declare-and-initialize-a-dictionary-in-typescript
  let convertedObject: ConvertedArticleSearchArgs =
    {} as ConvertedArticleSearchArgs;

  Object.keys(searchParams).forEach(
    (k) =>
      (convertedObject[k.replace('Contains', '') as FilterableFields] = {
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

export const GET_ARTICLE_QUERY = gql`
  query GetArticle(
    $id: String!
    $contentType: ContentType
    $publishingLevel: PublishingLevel
  ) {
    article(
      id: $id
      contentType: $contentType
      publishingLevel: $publishingLevel
    ) {
      id
      title
      content
      source
      sourceURL
      tags
      publishedDate
      publishingLevel
      contentType
    }
  }
`;

export const ARTICLE_UPDATE_SUBSCRIPTION = gql`
  subscription OnArticleUpdate(
    $id: String!
    $contentType: ContentType
    $publishingLevel: PublishingLevel
  ) {
    article: articleUpdate(
      id: $id
      contentType: $contentType
      publishingLevel: $publishingLevel
    ) {
      id
      title
      content
      source
      sourceURL
      tags
      publishedDate
      publishingLevel
      contentType
    }
  }
`;

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
