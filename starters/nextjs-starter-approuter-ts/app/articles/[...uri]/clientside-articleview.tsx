"use client";

import { PantheonProvider } from "@pantheon-systems/pcc-react-sdk";
import {
  Article,
  PCCConvenienceFunctions,
} from "@pantheon-systems/pcc-sdk-core";
import ArticleView from "../../../components/article-view";

export default function ClientsideArticleView({
  grant,
  article,
}: {
  grant: string;
  article: Article;
}) {
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
}
