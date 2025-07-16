/**
 * @jest-environment jsdom
 */

import { Article } from "@pantheon-systems/pcc-sdk-core/types";
import { render } from "@testing-library/react";
import { ArticleRenderer, getArticleTitle } from "../../src/components";
import articleWithImageMarkdown from "../data/article-with-image-markdown.json";
import articleWithImageTree from "../data/article-with-image-tree.json";
import article from "../data/article.json";

describe("<ArticleRenderer />", () => {
  it("should render a post's content", () => {
    const { container } = render(
      <ArticleRenderer
        article={article as Article}
        __experimentalFlags={{ useUnintrusiveTitleRendering: true }}
      />,
    );
    const title = getArticleTitle(article as Article);
    expect(title).toEqual("Test 1");
    expect(container.firstChild).toMatchSnapshot();
  });

  it("should replace the CDN URL with the override (markdown)", () => {
    const { container } = render(
      <ArticleRenderer
        article={articleWithImageMarkdown as Article}
        __experimentalFlags={{ cdnURLOverride: "cdn.example.com" }}
      />,
    );
    expect(container.innerHTML).toMatch("https://cdn.example.com");
    expect(container.innerHTML).not.toMatch("https://cdn.staging.content");
    expect(container.firstChild).toMatchSnapshot();
  });

  it.skip("should replace the CDN URL with the override (tree)", () => {
    const { container } = render(
      <ArticleRenderer
        article={articleWithImageTree as Article}
        __experimentalFlags={{ cdnURLOverride: "cdn.example.com" }}
      />,
    );
    expect(container.innerHTML.includes("https://cdn.example.com")).toBe(true);
    expect(container.innerHTML.includes("https://cdn.staging.content")).toBe(
      false,
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
