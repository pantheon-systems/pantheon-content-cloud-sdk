import { type Article } from "@pantheon-systems/pcc-sdk-core";
import {
  PantheonTree,
  PantheonTreeNode,
  TreePantheonContent,
} from "@pantheon-systems/pcc-sdk-core/types";

export type RendererConfig = {
  disableStyles?: boolean;
};

export function renderArticleToElement(
  article: Article,
  element: HTMLElement,
  config?: RendererConfig,
) {
  if (!article.content) {
    throw new Error("Article has no content. Publish the article to view it.");
  }

  if (
    article.contentType !== "TREE_PANTHEON" &&
    article.contentType !== "TREE_PANTHEON_V2"
  ) {
    throw new Error(
      `Unsupported content type: ${article.contentType}. PCC Document only supports TREE_PANTHEON and TREE_PANTHEON_V2`,
    );
  }

  const content = JSON.parse(article.content) as
    | PantheonTree
    | TreePantheonContent[];

  // V1 content is array of TreePantheonContent
  if (Array.isArray(content)) {
    console.warn(
      "Outdated content format detected. Your content may not render correctly. Please republish your article.",
    );
  }

  const contentNodes = Array.isArray(content)
    ? content
    : content.children || [];

  // Parent node to be added to the DOM
  const documentNode = document.createElement("div");

  // Add PCC content to the document node
  contentNodes.forEach((node) => {
    documentNode.appendChild(renderContentNode(node, config));
  });

  // Clear fallback content
  element.innerHTML = "";

  // Append the document node
  element.appendChild(documentNode);

  return element;
}

export const renderContentNode = (
  element: PantheonTreeNode | TreePantheonContent,
  config?: RendererConfig,
): HTMLElement => {
  const node = document.createElement(element.tag);

  // Remove styles and classes if disableStyles is true
  if (config?.disableStyles) {
    delete element.style;
    delete element.attrs?.class;
  }

  if (element.attrs) {
    Object.entries(element.attrs).forEach(([key, value]) => {
      node.setAttribute(key, String(value));
    });
  }

  if (element.style) {
    node.setAttribute("style", element.style.join(";"));
  }

  if (element.data) {
    node.innerHTML = element.data;
  }

  // Render child nodes recursively
  if (element.children) {
    element.children.forEach((child) => {
      node.appendChild(renderContentNode(child, config));
    });
  }

  return node;
};
