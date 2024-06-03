"use client";

import {
  Article,
  PantheonProvider,
  PCCConvenienceFunctions,
} from "@pantheon-systems/pcc-react-sdk";
import ArticleView from "../../../components/article-view";

export const ClientsideArticleView = ({
  grant,
  article,
}: {
  grant: string;
  article: Article;
}) => {
  return (
    <PantheonProvider
      client={PCCConvenienceFunctions.buildPantheonClient({
        isClientSide: true,
        pccGrant: grant,
      })}
    >
      <ArticleView article={article} />
    </PantheonProvider>
  );
};
