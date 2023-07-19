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

export interface ArticleSearchArgs {
  tagContains: string;
  titleContains: string;
  bodyContains: string;
}

export const LIST_ARTICLES_QUERY = gql`
  query ListArticles(
    $contentType: ContentType
    $publishingLevel: PublishingLevel
    $filter: ArticleFilterInput
  ) {
    articles(contentType: $contentType, publishingLevel: $publishingLevel) {
      id
      title
      source
      sourceURL
      keywords
      publishedDate
      publishingLevel
      contentType
    }
  }
`;

export function convertSearchParamsToGQL(searchParams?: ArticleSearchArgs) {
  if (!searchParams) return null;

  return {
    filter: {
      title: searchParams?.titleContains
        ? {
            contains: searchParams.titleContains,
          }
        : undefined,
      // body: searchParams?.bodyContains
      //   ? {
      //       contains: searchParams.bodyContains,
      //     }
      //   : undefined,
      // tag: searchParams?.tagContains
      //   ? {
      //       contains: searchParams.tagContains,
      //     }
      //   : undefined,
    },
  };
}

export async function getArticles(
  client: PantheonClient,
  args?: ArticleQueryArgs,
  searchParams?: ArticleSearchArgs,
) {
  const articles = await client.apolloClient.query({
    query: LIST_ARTICLES_QUERY,
    variables: args,
    // variables: {
    //   ...args,
    //   ...convertSearchParamsToGQL(searchParams),
    // },
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
      keywords
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
      keywords
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
