import { useArticle } from "@pantheon-systems/pcc-react-sdk";
import { ArticleRenderer, useArticleTitle } from "@pantheon-systems/pcc-react-sdk/components";
import { clientSmartComponentMap } from "./smart-components";

export default function ArticleView({ article }) {
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
  const articleTitle = useArticleTitle(article);

  return (
    <>
      <div>
        <div className="text-3xl font-bold md:text-4xl">{articleTitle}</div>

        {article.updatedAt ? (
          <p className="py-2">
            Last Updated:{" "}
            {new Date(article.updatedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        ) : null}

        <hr className="mt-6 mb-8" />
      </div>
      <ArticleRenderer
        article={hydratedArticle}
        smartComponentMap={clientSmartComponentMap}
        __experimentalFlags={{ useUnintrusiveTitleRendering: true }}
      />
    </>
  );
}
