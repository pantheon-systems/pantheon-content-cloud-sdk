import { useArticle } from "@pantheon-systems/pcc-react-sdk";
import {
  ArticleRenderer,
  useArticleTitle,
} from "@pantheon-systems/pcc-react-sdk/components";
import { useMemo } from "react";
import { clientSmartComponentMap } from "./smart-components";

export default function ArticleView({ article, onlyContent }) {
  const { data } = useArticle(
    article.id,
    {
      publishingLevel: article.publishingLevel,
      contentType: "TREE_PANTHEON_V2",
    },
    {
      skip: article.publishingLevel !== "REALTIME",
    },
  );

  const hydratedArticle = useMemo(
    () => data?.article ?? article,
    [data, article],
  );

  return (
    <StaticArticleView article={hydratedArticle} onlyContent={onlyContent} />
  );
}

export function StaticArticleView({ article, onlyContent }) {
  const articleTitle = useArticleTitle(article);

  return (
    <>
      <div>
        <div className="text-5xl font-bold">{articleTitle}</div>

        {article.updatedAt ? (
          <p className="py-2">
            {new Date(article.updatedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        ) : null}
      </div>
      <ArticleRenderer
        article={article}
        smartComponentMap={clientSmartComponentMap}
        __experimentalFlags={{
          useUnintrusiveTitleRendering: true,
          disableAllStyles: !!onlyContent,
        }}
      />
    </>
  );
}
