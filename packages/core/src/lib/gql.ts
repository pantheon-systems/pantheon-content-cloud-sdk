import gql from "graphql-tag";

export const GET_ARTICLE_QUERY = gql`
  query GetArticle(
    $id: String
    $slug: String
    $contentType: ContentType
    $publishingLevel: PublishingLevel
  ) {
    article(
      id: $id
      slug: $slug
      contentType: $contentType
      publishingLevel: $publishingLevel
    ) {
      id
      title
      content
      slug
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
      slug
      tags
      publishedDate
      publishingLevel
      contentType
    }
  }
`;

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
      slug
      tags
      publishedDate
      publishingLevel
      contentType
    }
  }
`;
