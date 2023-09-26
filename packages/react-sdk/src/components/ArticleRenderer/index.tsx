import {
  Article,
  TreePantheonContent,
} from "@pantheon-systems/pcc-sdk-core/types";
import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { ReactMarkdown } from "react-markdown/lib/react-markdown.js";
import rehypeRaw from "rehype-raw";
import { PreviewBar } from "../Preview/Preview";
import ArticleComponent from "./ArticleComponent";
import TopLevelElement from "./TopLevelElement";

export type SmartComponentMap = {
  [key: string]: {
    reactComponent: React.FunctionComponent;
    title: string;
    iconUrl?: string | null | undefined;
    fields: {
      [key: string]: {
        displayName: string | null | undefined;
        required?: boolean | null | undefined;
        type: string;
      };
    };
  };
};

interface Props {
  article?: Article;
  bodyClassName?: string;
  containerClassName?: string;
  headerClassName?: string;
  renderTitle?: (titleElement: React.ReactElement) => React.ReactNode;
  smartComponentMap?: SmartComponentMap;
  timeout?: number;
}

const ArticleRenderer = ({
  article,
  headerClassName,
  bodyClassName,
  containerClassName,
  renderTitle,
  smartComponentMap,
  timeout,
}: Props) => {
  const [renderCSR, setRenderCSR] = React.useState(false);

  useEffect(() => {
    setRenderCSR(true);
  }, []);

  const contentType = article?.contentType;

  if (contentType === "TEXT_MARKDOWN") {
    return (
      <div className={containerClassName}>
        {renderCSR && article != null
          ? createPortal(
              <PreviewBar article={article} timeout={timeout} />,
              document.body,
            )
          : null}

        {article?.content ? (
          <ReactMarkdown rehypePlugins={[rehypeRaw]}>
            {String(article.content)}
          </ReactMarkdown>
        ) : (
          <span>No content to display</span>
        )}
      </div>
    );
  }

  const parsedBody: TreePantheonContent[] = article?.content
    ? JSON.parse(article.content)
    : [];
  const indexOfFirstHeader = parsedBody.findIndex((x) =>
    ["h1", "h2", "h3", "h4", "h5", "h6", "h7", "title"].includes(x.tag),
  );

  const indexOfFirstParagraph = parsedBody.findIndex((x) => x.tag === "p");
  const resolvedTitleIndex =
    indexOfFirstHeader === -1 ? indexOfFirstParagraph : indexOfFirstHeader;

  const [titleElement] = parsedBody.splice(resolvedTitleIndex, 1);

  const titleComponent = titleElement ? (
    <ArticleComponent
      x={titleElement.children}
      smartComponentMap={smartComponentMap}
    />
  ) : (
    <span>{article?.title}</span>
  );

  return (
    <div className={containerClassName}>
      {renderCSR && article != null
        ? createPortal(
            <PreviewBar article={article} timeout={timeout} />,
            document.body,
          )
        : null}

      <div className={headerClassName}>
        {renderTitle ? renderTitle(titleComponent) : titleComponent}
      </div>
      <div className={bodyClassName}>
        {parsedBody?.map((x, idx: number) => (
          // No stable key available
          // eslint-disable-next-line react/no-array-index-key
          <TopLevelElement
            key={idx}
            element={x}
            smartComponentMap={smartComponentMap}
          />
        ))}
      </div>
    </div>
  );
};

export default ArticleRenderer;
