import { gql } from "@apollo/client";
import { useQuery } from "@vue/apollo-composable";
import { Article, ArticleQueryArgs } from "src/types/Article";

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

type GetArticleQueryResult = {
  article: Article;
};

export const useArticle = (id: string, args?: ArticleQueryArgs) => {
  return useQuery<GetArticleQueryResult>(GET_ARTICLE_QUERY, {
    id,
    ...args,
  });
};
