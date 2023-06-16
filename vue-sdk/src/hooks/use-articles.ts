import { gql } from "@apollo/client";
import { useQuery } from "@vue/apollo-composable";
import { ArticleQueryArgs, ArticleWithoutContent } from "src/types/Article";

type ListArticlesResponse = {
  articles: ArticleWithoutContent[];
};

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

export const useArticles = (args?: ArticleQueryArgs) => {
  return useQuery<ListArticlesResponse>(LIST_ARTICLES_QUERY, {
    variables: args,
  });
};
