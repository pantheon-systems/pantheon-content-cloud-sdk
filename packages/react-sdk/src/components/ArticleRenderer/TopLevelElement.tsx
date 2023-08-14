import React from "react";
import { SmartComponentMap } from ".";
import ArticleComponent from "./ArticleComponent";

interface Props {
  element: any;
  smartComponentMap?: SmartComponentMap;
}

const TopLevelElement = ({ element, smartComponentMap }: Props) => {
  if (element.tag === "hr") {
    return <hr />;
  }

  const children = (
    <ArticleComponent
      x={element.children}
      smartComponentMap={smartComponentMap}
    />
  );

  const articleComponents = ["h1", "h2", "h3", "h4", "h5", "h6"];

  if (articleComponents.includes(element.tag)) {
    return React.createElement(element.tag, { ...element.attrs }, children);
  }

  if (element.tag === "table") {
    return (
      <table className="text-black">
        <tbody>{children}</tbody>
      </table>
    );
  }

  if (element.tag === "p" || element.tag === "span") {
    if (
      !element.data &&
      element.children?.every(
        (child: { data: string | null; children: unknown[] | null }) =>
          !child.data && !child.children,
      )
    ) {
      // Empty paragraph
      return <br />;
    }

    return <div>{children}</div>;
  }
  if (element.tag === "ul" && element.children.length) {
    return <ul>{children}</ul>;
  }
  if (element.tag === "ol" && element.children.length) {
    return <ol>{children}</ol>;
  }
  if (element.tag === "component") {
    return (
      <ArticleComponent x={element} smartComponentMap={smartComponentMap} />
    );
  }
  return null;
};

export default TopLevelElement;
