/**
 * Static helper functions for articles
 */

import { PantheonClient } from '../../core/pantheon-client';
import { Article, ArticleWithoutContent } from '../../types';
import { gql } from '../apollo-client';

export const LIST_ARTICLES_QUERY = gql`
  query ListArticles {
    articles {
      id
      title
      source
      sourceURL
      keywords
      publishedDate
    }
  }
`;

export async function getArticles(client: PantheonClient) {
  const articles = await client.apolloClient.query({
    query: LIST_ARTICLES_QUERY,
  });

  return articles.data.articles as ArticleWithoutContent[];
}

export const GET_ARTICLE_QUERY = gql`
  query GetArticle($id: String!) {
    article(id: $id) {
      id
      title
      content
      source
      sourceURL
      keywords
      publishedDate
    }
  }
`;

export async function getArticle(client: PantheonClient, id: string) {
  const article = await client.apolloClient.query({
    query: GET_ARTICLE_QUERY,
    variables: { id },
  });

  return article.data.article as Article;
}
