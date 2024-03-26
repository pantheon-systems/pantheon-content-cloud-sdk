import {
  Article,
  PantheonTree,
  PantheonTreeNode,
  TreePantheonContent,
  type SmartComponentMap as CoreSmartComponentMap,
} from "@pantheon-systems/pcc-sdk-core/types";
import { Element } from "hast";
import _ from "lodash";
import React, { useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { PreviewBar, PreviewBarExternalProps } from "../Preview/Preview";
import MarkdownRenderer from "./Markdown";
import PantheonTreeRenderer from "./PantheonTreeRenderer";
import PantheonTreeV2Renderer from "./PantheonTreeV2Renderer";

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
  renderTitle?: (titleElement: React.ReactElement) => React.ReactNode;
  smartComponentMap?: SmartComponentMap;
  previewBarProps?: PreviewBarExternalProps;
  componentMap?: ComponentMap;
  renderBody?: (bodyElement: React.ReactElement) => React.ReactNode;
  __experimentalFlags?: {
    disableAllStyles?: boolean;
    disableDefaultErrorBoundaries?: boolean;
  };
}

function useArticleTitle(
  article: Article | undefined,
  { enabled = true }: { enabled: boolean },
) {
  return useMemo(() => {
    if (!article?.content) {
      return null;
    }

    const contentType = article?.contentType;

    if (contentType === "TEXT_MARKDOWN") {
      return null;
    }

    let jsonContent = JSON.parse(article.content) as
      | PantheonTree
      | TreePantheonContent[];
    const content = Array.isArray(jsonContent)
      ? jsonContent
      : jsonContent.children;

    const titleContent = content.find((x) => x.tag === "title")!;

    if (titleContent != null) {
      const flatMap = titleContent.children
        ? _.flatMapDeep(
            titleContent.children,
            (x: PantheonTreeNode | TreePantheonContent) => x.data,
          )
        : [];

      return titleContent.data + flatMap.join("");
    } else if (article?.metadata?.title != null) {
      return article.metadata.title;
    } else {
      return article.title || "";
    }
  }, [article]);
}

const ArticleRenderer = ({
  article,
  bodyClassName,
  containerClassName,
  renderTitle,
  smartComponentMap,
  previewBarProps,
  componentMap,
  renderBody,
  __experimentalFlags,
}: Props) => {
  const [renderCSR, setRenderCSR] = React.useState(false);
  // const articleTitle = useArticleTitle(article, {
  //   enabled: renderTitle != null,
  // });

  if (renderTitle != null) {
    console.warn("renderTitle is no longer supported");
  }

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
          disableDefaultErrorBoundaries:
            !!__experimentalFlags?.disableDefaultErrorBoundaries,
        }),
      )}
    </div>
  );

  return (
    <div className={containerClassName}>
      {renderCSR && article != null && article.publishingLevel === "REALTIME"
        ? createPortal(
            <PreviewBar {...previewBarProps} article={article} />,
            document.body,
          )
        : null}

      {renderBody ? renderBody(bodyElement) : bodyElement}
    </div>
  );
};

export default ArticleRenderer;
