"use client";

import {
  Article,
  PantheonProvider,
  PCCConvenienceFunctions,
  updateConfig,
} from "@pantheon-systems/pcc-react-sdk";
import ArticleView from "../../../components/article-view";

updateConfig({
  siteId: process.env.NEXT_PUBLIC_PCC_SITE_ID,
});

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
