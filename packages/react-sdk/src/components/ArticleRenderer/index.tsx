import {
  Article,
  TreePantheonContent,
} from "@pantheon-systems/pcc-sdk-core/types";
import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { ReactMarkdown } from "react-markdown/lib/react-markdown.js";
import rehypeRaw from "rehype-raw";
import { PreviewBar } from "../Preview/Preview";
import PantheonTreeRenderer from "./PantheonTreeRenderer";

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
}

const ArticleRenderer = ({
  article,
  headerClassName,
  bodyClassName,
  containerClassName,
  renderTitle,
  smartComponentMap,
}: Props) => {
  const [renderCSR, setRenderCSR] = React.useState(false);

  useEffect(() => {
    setRenderCSR(true);
  }, []);

  const contentType = article?.contentType;

  if (contentType === "TEXT_MARKDOWN") {
    return (
      <div className={containerClassName}>
        {renderCSR && article != null && article.publishingLevel === "REALTIME"
          ? createPortal(<PreviewBar article={article} />, document.body)
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

  const titleText = getTextFromNode(titleElement);

  return (
    <div className={containerClassName}>
      {renderCSR && article != null && article.publishingLevel === "REALTIME"
        ? createPortal(<PreviewBar article={article} />, document.body)
        : null}

      <div className={headerClassName}>
        {renderTitle
          ? renderTitle(<span>{titleText}</span>)
          : React.createElement(PantheonTreeRenderer, {
              element: titleElement,
              smartComponentMap,
            })}
      </div>
      <div className={bodyClassName}>
        {parsedBody?.map((element, idx) =>
          React.createElement(PantheonTreeRenderer, {
            key: idx,
            element,
            smartComponentMap,
          }),
        )}
      </div>
    </div>
  );
};

function getTextFromNode(
  node: TreePantheonContent | undefined,
): string | undefined {
  if (!node) {
    return undefined;
  }

  if (typeof node.data === "string" && node.data) {
    return node.data;
  }

  if (node.children) {
    return node.children.map(getTextFromNode).join("\n");
  }

  return undefined;
}

export default ArticleRenderer;
