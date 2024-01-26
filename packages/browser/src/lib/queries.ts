export const GET_ARTICLE_QUERY = `
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
