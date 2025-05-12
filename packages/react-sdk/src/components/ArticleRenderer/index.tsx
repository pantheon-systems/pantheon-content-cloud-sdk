import { findTab } from "@pantheon-systems/pcc-sdk-core";
import {
  Article,
  PantheonTreeNode,
  TabTree,
  type SmartComponentMap as CoreSmartComponentMap,
} from "@pantheon-systems/pcc-sdk-core/types";
import { Element } from "hast";
import React, { useEffect, useMemo } from "react";
import { getTextContent } from "../../utils/react-element";
import MarkdownRenderer from "./Markdown";
import PantheonTreeV2Renderer from "./PantheonTreeV2Renderer";

export { getArticleTitle, useArticleTitle } from "./useArticleTitle";

export type ServersideSmartComponentMap = {
  [K in keyof CoreSmartComponentMap]: CoreSmartComponentMap[K];
};

export type SmartComponentMap = {
  [K in keyof CoreSmartComponentMap]: CoreSmartComponentMap[K] & {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    reactComponent: (props: any) => React.JSX.Element;
  };
};

type ExtraProps = {
  // If Content type is Markdown
  node?: Element;
};

export type ComponentMap = Partial<{
  [TagName in keyof JSX.IntrinsicElements]:
    | (new (
        props: JSX.IntrinsicElements[TagName] & ExtraProps,
      ) => JSX.ElementClass)
    // Function component:
    | ((props: JSX.IntrinsicElements[TagName] & ExtraProps) => JSX.Element)
    // Tag name:
    | keyof JSX.IntrinsicElements;
}>;

interface Props {
  article?: Article;
  tabId?: string | null;
  bodyClassName?: string;
  containerClassName?: string;
  headerClassName?: string;
  renderTitle?: (
    titleElement: React.ReactElement,
    content: string,
  ) => React.ReactNode;
  smartComponentMap?: SmartComponentMap;
  componentMap?: ComponentMap;
  renderBody?: (bodyElement: React.ReactElement) => React.ReactNode;
  __experimentalFlags?: {
    disableAllStyles?: boolean;
    preserveImageStyles?: boolean;
    disableDefaultErrorBoundaries?: boolean;
    useUnintrusiveTitleRendering?: boolean;
  };
}

function UnboxContent(content: string) {
  try {
    return JSON.parse(content);
  } catch (e) {
    return content;
  }
}

const ArticleRenderer = ({
  article,
  tabId,
  bodyClassName,
  containerClassName,
  headerClassName,
  renderTitle,
  smartComponentMap,
  componentMap,
  renderBody,
  __experimentalFlags,
}: Props) => {
  useEffect(() => {
    if (__experimentalFlags?.useUnintrusiveTitleRendering !== true) {
      console.warn(
        "PCC Deprecation Warning: ArticleRenderer's renderTitle will no longer be supported in a future release.",
      );
    }
  }, [__experimentalFlags]);

  const contentType = article?.contentType;
  const unboxedContent = useMemo(
    () =>
      article?.resolvedContent ? UnboxContent(article.resolvedContent) : null,
    [article?.resolvedContent, article?.updatedAt],
  );

  console.log({ unboxedContent });
  const contentToShow = useMemo(() => {
    if (!unboxedContent) return null;

    const content =
      (tabId != null && findTab(unboxedContent, tabId)?.documentTab) ||
      unboxedContent;

    if (
      tabId == null &&
      typeof unboxedContent === "object" &&
      content?.children == null
    ) {
      return Array.isArray(unboxedContent)
        ? unboxedContent[0]?.documentTab
        : (unboxedContent as TabTree<any>)?.documentTab;
    }

    return content;
  }, [tabId, unboxedContent]);

  if (!contentToShow) {
    return null;
  }

  if (contentType === "TEXT_MARKDOWN") {
    return (
      <div className={containerClassName}>
        {contentToShow ? (
          <MarkdownRenderer
            smartComponentMap={smartComponentMap}
            componentMap={componentMap}
            disableDefaultErrorBoundaries={
              !!__experimentalFlags?.disableDefaultErrorBoundaries
            }
          >
            {contentToShow}
          </MarkdownRenderer>
        ) : (
          <span>No content to display</span>
        )}
      </div>
    );
  }

  const parsedContent: PantheonTreeNode[] = contentToShow.children || [];

  let titleElement = null;

  if (__experimentalFlags?.useUnintrusiveTitleRendering !== true) {
    const indexOfFirstHeader = parsedContent.findIndex((x) =>
      ["h1", "h2", "h3", "h4", "h5", "h6", "h7", "title"].includes(x.tag),
    );

    const indexOfFirstParagraph = parsedContent.findIndex((x) => x.tag === "p");
    const resolvedTitleIndex =
      indexOfFirstHeader === -1 ? indexOfFirstParagraph : indexOfFirstHeader;

    const [titleContent] = parsedContent.splice(resolvedTitleIndex, 1);

    // @ts-expect-error Dynamic component props
    titleElement = React.createElement(renderer, {
      element: titleContent,
      componentMap,
      smartComponentMap,
      disableAllStyles: !!__experimentalFlags?.disableAllStyles,
      preserveImageStyles: !!__experimentalFlags?.preserveImageStyles,
      disableDefaultErrorBoundaries:
        !!__experimentalFlags?.disableDefaultErrorBoundaries,
    });
  }

  const bodyElement = (
    <div className={bodyClassName}>
      {parsedContent?.map((element, idx) =>
        React.createElement(PantheonTreeV2Renderer, {
          key: idx,
          element,
          smartComponentMap,
          componentMap,
          disableAllStyles: !!__experimentalFlags?.disableAllStyles,
          preserveImageStyles: !!__experimentalFlags?.preserveImageStyles,
          disableDefaultErrorBoundaries:
            !!__experimentalFlags?.disableDefaultErrorBoundaries,
        }),
      )}
    </div>
  );

  return (
    <div className={containerClassName}>
      {titleElement != null ? (
        <div className={headerClassName}>
          {renderTitle
            ? renderTitle(titleElement, getTextContent(titleElement))
            : titleElement}
        </div>
      ) : null}
      {renderBody ? renderBody(bodyElement) : bodyElement}
    </div>
  );
};

export default ArticleRenderer;
