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
      siteId
      metadata
      publishedDate
      publishingLevel
      contentType
      updatedAt
      previewActiveUntil
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
      siteId
      content
      slug
      tags
      metadata
      publishedDate
      publishingLevel
      contentType
      updatedAt
      previewActiveUntil
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
      siteId
      slug
      tags
      metadata
      publishedDate
      publishingLevel
      contentType
      updatedAt
      previewActiveUntil
    }
  }
`;

export const LIST_ARTICLES_QUERY_W_CONTENT = gql`
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
      siteId
      tags
      metadata
      publishedDate
      publishingLevel
      contentType
      content
      updatedAt
      previewActiveUntil
    }
  }
`;

export const LIST_PAGINATED_ARTICLES_QUERY = gql`
  query ListArticles(
    $pageSize: Int
    $sortBy: ArticleSortField
    $sortOrder: SortOrder
    $cursor: Float
    $contentType: ContentType
    $publishingLevel: PublishingLevel
    $filter: ArticleFilterInput
  ) {
    articles(
      pageSize: $pageSize
      sortBy: $sortBy
      sortOrder: $sortOrder
      cursor: $cursor
      contentType: $contentType
      publishingLevel: $publishingLevel
      filter: $filter
    ) {
      id
      title
      siteId
      slug
      tags
      metadata
      publishedDate
      publishingLevel
      contentType
      updatedAt
      previewActiveUntil
    }
  }
`;

export const LIST_PAGINATED_ARTICLES_QUERY_W_CONTENT = gql`
  query ListArticles(
    $pageSize: Int
    $sortBy: ArticleSortField
    $sortOrder: SortOrder
    $cursor: Float
    $contentType: ContentType
    $publishingLevel: PublishingLevel
    $filter: ArticleFilterInput
  ) {
    articles(
      pageSize: $pageSize
      sortBy: $sortBy
      sortOrder: $sortOrder
      cursor: $cursor
      contentType: $contentType
      publishingLevel: $publishingLevel
      filter: $filter
    ) {
      id
      title
      siteId
      tags
      metadata
      publishedDate
      publishingLevel
      contentType
      content
      updatedAt
      previewActiveUntil
    }
  }
`;

export const GET_RECOMMENDED_ARTICLES_QUERY = gql`
  query GetRecommendedArticle($id: String!) {
    recommendedArticles(id: $id) {
      id
      title
      content
      slug
      tags
      siteId
      metadata
      publishedDate
      publishingLevel
      contentType
      updatedAt
      previewActiveUntil
    }
  }
`;
