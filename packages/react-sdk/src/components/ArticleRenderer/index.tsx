import {
  Article,
  PantheonTree,
  TreePantheonContent,
  type SmartComponentMap as CoreSmartComponentMap,
} from "@pantheon-systems/pcc-sdk-core/types";
import { Element } from "hast";
import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { getTextContent } from "../../utils/react-element";
import { PreviewBar, PreviewBarExternalProps } from "../Preview/Preview";
import MarkdownRenderer from "./Markdown";
import PantheonTreeRenderer from "./PantheonTreeRenderer";
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
  bodyClassName?: string;
  containerClassName?: string;
  headerClassName?: string;
  renderTitle?: (
    titleElement: React.ReactElement,
    content: string,
  ) => React.ReactNode;
  smartComponentMap?: SmartComponentMap;
  previewBarProps?: PreviewBarExternalProps;
  componentMap?: ComponentMap;
  renderBody?: (bodyElement: React.ReactElement) => React.ReactNode;
  __experimentalFlags?: {
    disableAllStyles?: boolean;
    preserveImageStyles?: boolean;
    disableDefaultErrorBoundaries?: boolean;
    useUnintrusiveTitleRendering?: boolean;
  };
}

function getOrCreatePortalTarget(
  targetOverride: globalThis.Element | null | undefined,
) {
  const pccGeneratedPortalTargetKey = "__pcc-portal-target__";
  let portalTarget =
    targetOverride || document.getElementById(pccGeneratedPortalTargetKey);

  if (!portalTarget) {
    portalTarget = document.createElement("div");
    portalTarget.id = pccGeneratedPortalTargetKey;
    document.body.prepend(portalTarget);
  }

  return portalTarget;
}

const ArticleRenderer = ({
  article,
  bodyClassName,
  containerClassName,
  headerClassName,
  renderTitle,
  smartComponentMap,
  previewBarProps,
  componentMap,
  renderBody,
  __experimentalFlags,
}: Props) => {
  const [renderCSR, setRenderCSR] = React.useState(false);

  useEffect(() => {
    if (__experimentalFlags?.useUnintrusiveTitleRendering !== true) {
      console.warn(
        "PCC Deprecation Warning: ArticleRenderer's renderTitle will no longer be supported in a future release.",
      );
    }
  }, [__experimentalFlags]);

  useEffect(() => {
    setRenderCSR(true);
  }, []);

  if (!article?.content) {
    return null;
  }

  const portalTarget =
    renderCSR && typeof document !== "undefined"
      ? getOrCreatePortalTarget(previewBarProps?.portalTarget)
      : null;
  const contentType = article?.contentType;

  if (contentType === "TEXT_MARKDOWN") {
    return (
      <div className={containerClassName}>
        {renderCSR &&
        article != null &&
        portalTarget != null &&
        article.publishingLevel === "REALTIME"
          ? createPortal(
              <PreviewBar {...previewBarProps} article={article} />,
              portalTarget,
            )
          : null}

        {article?.content ? (
          <MarkdownRenderer
            smartComponentMap={smartComponentMap}
            componentMap={componentMap}
            disableDefaultErrorBoundaries={
              !!__experimentalFlags?.disableDefaultErrorBoundaries
            }
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
        // @ts-expect-error Dynamic component props
        React.createElement(renderer, {
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
      {renderCSR &&
      article != null &&
      portalTarget != null &&
      article.publishingLevel === "REALTIME"
        ? createPortal(
            <PreviewBar {...previewBarProps} article={article} />,
            portalTarget,
          )
        : null}

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
