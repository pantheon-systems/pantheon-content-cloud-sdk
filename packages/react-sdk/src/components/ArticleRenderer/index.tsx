import {
  Article,
  PantheonTree,
  PantheonTreeNode,
  TreePantheonContent,
  type SmartComponentMap as CoreSmartComponentMap,
} from "@pantheon-systems/pcc-sdk-core/types";
import { Element } from "hast";
import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { PreviewBar, PreviewBarExternalProps } from "../Preview/Preview";
import MarkdownRenderer from "./Markdown";
import PantheonTreeRenderer from "./PantheonTreeRenderer";
import PantheonTreeV2Renderer from "./PantheonTreeV2Renderer";

export type SmartComponentMap = {
  [K in keyof CoreSmartComponentMap]: CoreSmartComponentMap[K] & {
    reactComponent: Parameters<typeof React.createElement>[0];
  };
};

type ExtraProps = {
  // If Content type is Markdown
  node?: Element;
};

export type ComponentsMap = Partial<{
  [TagName in keyof JSX.IntrinsicElements]:
    | (new (
        props: JSX.IntrinsicElements[TagName] & ExtraProps,
      ) => JSX.ElementClass)
    // Function component:
    | ((
        props: JSX.IntrinsicElements[TagName] & ExtraProps,
      ) => JSX.Element | string | null | undefined)
    // Tag name:
    | keyof JSX.IntrinsicElements;
}>;

interface Props {
  article?: Article;
  bodyClassName?: string;
  containerClassName?: string;
  headerClassName?: string;
  renderTitle?: (titleElement: React.ReactElement) => React.ReactNode;
  smartComponentMap?: SmartComponentMap;
  previewBarProps?: PreviewBarExternalProps;
  componentsMap?: ComponentsMap;
}

const ArticleRenderer = ({
  article,
  headerClassName,
  bodyClassName,
  containerClassName,
  renderTitle,
  smartComponentMap,
  previewBarProps,
  componentsMap,
}: Props) => {
  const [renderCSR, setRenderCSR] = React.useState(false);

  useEffect(() => {
    setRenderCSR(true);
  }, []);

  if (!article?.content) {
    return null;
  }

  const contentType = article?.contentType;

  if (contentType === "TEXT_MARKDOWN") {
    return (
      <div className={containerClassName}>
        {renderCSR && article != null && article.publishingLevel === "REALTIME"
          ? createPortal(
              <PreviewBar {...previewBarProps} article={article} />,
              document.body,
            )
          : null}

        {article?.content ? (
          <MarkdownRenderer
            smartComponentMap={smartComponentMap}
            componentsMap={componentsMap}
          >
            {article.content}
          </MarkdownRenderer>
        ) : (
          <span>No content to display</span>
        )}
      </div>
    );
  }

  const content = JSON.parse(article.content) as
    | PantheonTree
    | TreePantheonContent[];

  const renderer =
    // V1 content is array of TreePantheonContent
    Array.isArray(content) ? PantheonTreeRenderer : PantheonTreeV2Renderer;

  const parsedContent = Array.isArray(content)
    ? content
    : content.children || [];

  const indexOfFirstHeader = parsedContent.findIndex((x) =>
    ["h1", "h2", "h3", "h4", "h5", "h6", "h7", "title"].includes(x.tag),
  );

  const indexOfFirstParagraph = parsedContent.findIndex((x) => x.tag === "p");
  const resolvedTitleIndex =
    indexOfFirstHeader === -1 ? indexOfFirstParagraph : indexOfFirstHeader;

  const [titleElement] = parsedContent.splice(resolvedTitleIndex, 1);

  const titleText = getTextFromNode(titleElement);

  return (
    <div className={containerClassName}>
      {renderCSR && article != null && article.publishingLevel === "REALTIME"
        ? createPortal(
            <PreviewBar {...previewBarProps} article={article} />,
            document.body,
          )
        : null}

      <div className={headerClassName}>
        {renderTitle
          ? renderTitle(<span>{titleText}</span>)
          : // @ts-expect-error Dynamic component props
            React.createElement(renderer, {
              element: titleElement,
              smartComponentMap,
            })}
      </div>
      <div className={bodyClassName}>
        {parsedContent?.map((element, idx) =>
          // @ts-expect-error Dynamic component props
          React.createElement(renderer, {
            key: idx,
            element,
            smartComponentMap,
            componentsMap,
          }),
        )}
      </div>
    </div>
  );
};

function getTextFromNode(
  node: PantheonTreeNode | TreePantheonContent | undefined,
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
