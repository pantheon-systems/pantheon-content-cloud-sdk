import { GET_ARTICLE_QUERY } from "@pantheon-systems/pcc-sdk-core";
import { useQuery } from "@vue/apollo-composable";
import { Article, ArticleQueryArgs } from "src/types/Article";

type GetArticleQueryResult = {
  article: Article;
};

type Return = ReturnType<typeof useQuery<GetArticleQueryResult>> & {
  article: Article | undefined;
};

export const useArticle = (id: string, args?: ArticleQueryArgs): Return => {
  const queryData = useQuery<GetArticleQueryResult>(GET_ARTICLE_QUERY, {
    id,
    ...args,
  });

  return {
    ...queryData,
    article: queryData.result?.value?.article,
  };
};
