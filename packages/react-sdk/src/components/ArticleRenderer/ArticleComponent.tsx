import * as React from "react";
import { SmartComponentMap } from ".";
import { getStyleObjectFromString } from "../../utils/styles";
import { unescapeHTMLEntities } from "../../utils/unescape";
import TopLevelElement from "./TopLevelElement";

interface Props {
  x: any;
  smartComponentMap?: SmartComponentMap;
}

const ArticleComponent = ({
  x,
  smartComponentMap,
}: Props): React.ReactElement | null => {
  if (Array.isArray(x)) {
    return (
      <>
        {x.map((span: any, idx) => (
          // No stable key available
          // eslint-disable-next-line react/no-array-index-key
          <ArticleComponent
            key={idx}
            x={span}
            smartComponentMap={smartComponentMap}
          />
        ))}
      </>
    );
  }
  if (x == null) return null;

  const textContent = typeof x === "string" ? x : x.data;
  const styles = getStyleObjectFromString(x?.style || "");
  const isSuperscript = Boolean(styles["vertical-align"] === "super");
  const isSubscript = Boolean(styles["vertical-align"] === "sub");

  const articleComponents = ["li", "tr", "td"];

  if (articleComponents.includes(x.tag)) {
    return React.createElement(
      x.tag,
      { style: styles, ...x.attrs },
      React.createElement(ArticleComponent, {
        x: x.children,
        smartComponentMap,
      }),
    );
  }

  if (textContent?.trim().length) {
    const tag = isSuperscript ? "sup" : isSubscript ? "sub" : "span";
    return React.createElement(
      tag,
      { style: styles },
      unescapeHTMLEntities(textContent),
    );
  }

  if (x.tag === "span" && x.data == null) {
    return (
      <span>
        <ArticleComponent
          x={x.children}
          smartComponentMap={smartComponentMap}
        />
      </span>
    );
  }

  if (x.tag === "p") {
    return (
      <TopLevelElement element={x} smartComponentMap={smartComponentMap} />
    );
  }

  if (x.tag === "a") {
    return (
      <a href={x.href} target="_blank" rel="noopener noreferrer" style={styles}>
        {x.data}
      </a>
    );
  }

  if (x.tag === "img" || x.tag === "image") {
    return <img src={x.src} alt={x.alt} title={x.title} />;
  }

  if (x.type === "BLOCKQUOTE") {
    return (
      <blockquote>
        <p dir="ltr">QUOTE TEXT</p>
        <p dir="ltr">-&nbsp;QUOTE ATTRIBUTION</p>
      </blockquote>
    );
  }

  if (smartComponentMap?.[x.type?.toUpperCase()] != null) {
    return React.createElement(smartComponentMap[x.type.toUpperCase()], {
      ...x.attrs,
    });
  }

  return null;
};

export default ArticleComponent;
