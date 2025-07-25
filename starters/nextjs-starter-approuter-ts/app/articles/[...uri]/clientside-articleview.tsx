"use client";

import {
  Article,
  PantheonProvider,
  PCCConvenienceFunctions,
  updateConfig,
  type PublishingLevel,
} from "@pantheon-systems/pcc-react-sdk";
import ArticleView from "../../../components/article-view";

updateConfig({
  pccHost: (process.env.PCC_HOST || process.env.NEXT_PUBLIC_PCC_HOST) as string,
  siteId: (process.env.PCC_SITE_ID ||
    process.env.NEXT_PUBLIC_PCC_SITE_ID) as string,
});

export const ClientsideArticleView = ({
  article,
  grant,
  tabId,
  publishingLevel,
}: {
  article: Article;
  grant?: string | undefined;
  tabId?: string | null;
  publishingLevel: keyof typeof PublishingLevel;
}) => {
  return (
    <PantheonProvider
      client={PCCConvenienceFunctions.buildPantheonClient({
        isClientSide: true,
        pccGrant: grant,
      })}
    >
      <ArticleView article={article} tabId={tabId} publishingLevel={publishingLevel} />
    </PantheonProvider>
  );
};
