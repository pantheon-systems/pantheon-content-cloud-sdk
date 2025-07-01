import gql from "graphql-tag";

const ARTICLE_FIELDS_FRAGMENT = gql`
  fragment ArticleFields on Article {
    id
    title
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
`;

const SITE_FIELDS_FRAGMENT = gql`
  fragment SiteFields on Site {
    id
    name
    url
    domain
    contentStructure
    tags
    metadataFields
  }
`;

export function generateArticleQuery({
  withSite = false,
}: {
  withSite?: boolean;
}) {
  return gql`
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
        ...ArticleFields
        content
        ${
          withSite
            ? `
        site {
          ...SiteFields
        }`
            : ""
        }
      }
    }
    ${ARTICLE_FIELDS_FRAGMENT}
    ${withSite ? SITE_FIELDS_FRAGMENT : ""}
  `;
}

export const GET_ARTICLE_QUERY = generateArticleQuery({ withSite: false });

export const GET_ARTICLE_WITH_SITE_QUERY = generateArticleQuery({
  withSite: true,
});

export function generateArticleUpdateSubscription({
  withSite = false,
}: {
  withSite?: boolean;
}) {
  return gql`
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
        ...ArticleFields
        content
        ${
          withSite
            ? `
        site {
          ...SiteFields
        }`
            : ""
        }
      }
    }
    ${ARTICLE_FIELDS_FRAGMENT}
    ${withSite ? SITE_FIELDS_FRAGMENT : ""}
  `;
}

export const ARTICLE_UPDATE_SUBSCRIPTION = generateArticleUpdateSubscription({
  withSite: false,
});

export const ARTICLE_UPDATE_SUBSCRIPTION_WITH_SITE =
  generateArticleUpdateSubscription({
    withSite: true,
  });

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
    $cursor: String
    $metadataFilters: String
    $contentType: ContentType
    $publishingLevel: PublishingLevel
    $filter: ArticleFilterInput
    $preamble: String
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
      preamble: $preamble
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

export function generateListPaginatedArticlesGQL({
  withContent = false,
}: {
  withContent?: boolean;
}) {
  return gql`
    query ListArticles(
      $pageSize: Int
      $sortBy: ArticleSortField
      $sortOrder: SortOrder
      $cursor: String
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
          ...ArticleFields
          ${withContent ? "content" : ""}
        }
        pageInfo {
          totalCount
          nextCursor
        }
      }
    }
    ${ARTICLE_FIELDS_FRAGMENT}
  `;
}

export const LIST_PAGINATED_ARTICLES_QUERY = generateListPaginatedArticlesGQL({
  withContent: false,
});

export const LIST_PAGINATED_ARTICLES_QUERY_W_CONTENT =
  generateListPaginatedArticlesGQL({ withContent: true });

export const GET_RECOMMENDED_ARTICLES_QUERY = gql`
  query GetRecommendedArticle($id: String!) {
    recommendedArticles(id: $id) {
      ...ArticleFields
      content
    }
  }
  ${ARTICLE_FIELDS_FRAGMENT}
`;

export const GET_SITE_QUERY = gql`
  query GetSite($id: String!) {
    site(id: $id) {
      ...SiteFields
    }
  }
  ${SITE_FIELDS_FRAGMENT}
`;
