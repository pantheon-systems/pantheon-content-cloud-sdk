import React from "react";
import ArticleComponent from "./ArticleComponent";

const TopLevelElement = ({ element }: any) => {
  if (element.tag === "hr") {
    return <hr />;
  }

  const children = <ArticleComponent x={element.children} />;

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
    return <p>{children}</p>;
  }
  if (element.tag === "ul" && element.children.length) {
    return <ul>{children}</ul>;
  }
  if (element.tag === "ol" && element.children.length) {
    return <ol>{children}</ol>;
  }
  if (element.tag === "component") {
    return <ArticleComponent x={element} />;
  }
  return null;
};

export default TopLevelElement;
