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

export function generateListArticlesGQL({
  withContent = false,
  withSummary = false,
}: {
  withContent?: boolean;
  withSummary?: boolean;
}) {
  return gql`
  query ListArticles(
    $pageSize: Int
    $sortBy: ArticleSortField
    $sortOrder: SortOrder
    $cursor: Float
    $metadataFilters: String
    $contentType: ContentType
    $publishingLevel: PublishingLevel
    $filter: ArticleFilterInput
  ) {
    articlesv3(
      pageSize: $pageSize
      sortBy: $sortBy
      sortOrder: $sortOrder
      cursor: $cursor
      metadataFilters: $metadataFilters
      contentType: $contentType
      publishingLevel: $publishingLevel
      filter: $filter
    ) {
      articles {
        id
        title
        siteId
        tags
        metadata
        publishedDate
        publishingLevel
        contentType
        ${withContent ? "content" : ""}
        updatedAt
        previewActiveUntil
        snippet
      }
      ${withSummary ? "summary" : ""}
    }
  }
`;
}

export const LIST_ARTICLES_QUERY_W_CONTENT = generateListArticlesGQL({
  withContent: true,
});

export const LIST_ARTICLES_QUERY = generateListArticlesGQL({
  withContent: false,
  withSummary: false,
});

export const LIST_ARTICLES_QUERY_WITH_SUMMARY = generateListArticlesGQL({
  withContent: false,
  withSummary: true,
});

export const LIST_ARTICLES_QUERY_WITH_CONTENT_AND_SUMMARY =
  generateListArticlesGQL({
    withContent: true,
    withSummary: true,
  });

export const LIST_PAGINATED_ARTICLES_QUERY = gql`
  query ListArticles(
    $pageSize: Int
    $sortBy: ArticleSortField
    $sortOrder: SortOrder
    $cursor: Float
    $contentType: ContentType
    $publishingLevel: PublishingLevel
    $filter: ArticleFilterInput
    $metadataFilters: String
  ) {
    articlesv3(
      pageSize: $pageSize
      sortBy: $sortBy
      sortOrder: $sortOrder
      cursor: $cursor
      contentType: $contentType
      publishingLevel: $publishingLevel
      filter: $filter
      metadataFilters: $metadataFilters
    ) {
      articles {
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
      pageInfo {
        totalCount
        nextCursor
      }
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
    $metadataFilters: String
  ) {
    articlesv3(
      pageSize: $pageSize
      sortBy: $sortBy
      sortOrder: $sortOrder
      cursor: $cursor
      contentType: $contentType
      publishingLevel: $publishingLevel
      filter: $filter
      metadataFilters: $metadataFilters
    ) {
      articles {
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
      pageInfo {
        totalCount
        nextCursor
      }
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

export const GET_SITE_QUERY = gql`
  query GetSite($id: String!) {
    site(id: $id) {
      id
      name
      url
      domain
      contentStructure
      tags
      metadataFields
    }
  }
`;
