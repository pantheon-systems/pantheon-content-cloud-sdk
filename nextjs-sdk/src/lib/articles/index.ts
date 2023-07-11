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

export const LIST_ARTICLES_QUERY = gql`
  query ListArticles(
    $contentType: ContentType
    $publishingLevel: PublishingLevel
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

export async function getArticles(
  client: PantheonClient,
  args?: ArticleQueryArgs,
) {
  const articles = await client.apolloClient.query({
    query: LIST_ARTICLES_QUERY,
    variables: args,
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
