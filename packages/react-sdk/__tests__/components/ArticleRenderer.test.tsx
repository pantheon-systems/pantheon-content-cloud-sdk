import { Article } from "@pantheon-systems/pcc-sdk-core/types";
import renderer from "react-test-renderer";
import { ArticleRenderer, getArticleTitle } from "../../src/components";
import articleTabbedContent from "../data/article-tabbed-content.json";
import articleWithImageMarkdown from "../data/article-with-image-markdown.json";
import articleWithImageTree from "../data/article-with-image-tree.json";
import article from "../data/article.json";

describe("<ArticleRenderer />", () => {
  it("should render a post's content", () => {
    const tree = renderer
      .create(
        <ArticleRenderer
          article={article as Article}
          __experimentalFlags={{ useUnintrusiveTitleRendering: true }}
        />,
      )
      .toJSON();
    const title = getArticleTitle(article as Article);
    expect(title).toEqual("Test 1");
    expect(tree).toMatchSnapshot();
  });

  it("should replace the CDN URL with the override (markdown)", () => {
    const tree = renderer
      .create(
        <ArticleRenderer
          article={articleWithImageMarkdown as Article}
          __experimentalFlags={{ cdnURLOverride: "cdn.example.com" }}
        />,
      )
      .toJSON();

    expect(JSON.stringify(tree)).toMatch("https://cdn.example.com");
    expect(JSON.stringify(tree)).not.toMatch("https://cdn.staging.content");
    expect(tree).toMatchSnapshot();
  });

  it("should replace the CDN URL with the override (markdown)", () => {
    const defaultTabTree = renderer
      .create(
        <ArticleRenderer
          article={articleTabbedContent as Article}
          __experimentalFlags={{ cdnURLOverride: "cdn.example.com" }}
        />,
      )
      .toJSON();

    const tab1Tree = renderer
      .create(
        <ArticleRenderer
          article={articleTabbedContent as Article}
          tabId="t.0"
        />,
      )
      .toJSON();

    expect(JSON.stringify(defaultTabTree)).toEqual(JSON.stringify(tab1Tree));
    expect(JSON.stringify(tab1Tree).includes("Tab 1")).toBe(true);
    expect(JSON.stringify(tab1Tree).includes("Tab 2")).toBe(false);
    expect(tab1Tree).toMatchSnapshot();

    const tab2Tree = renderer
      .create(
        <ArticleRenderer
          article={articleTabbedContent as Article}
          tabId="t.tlembaievla6"
          __experimentalFlags={{ cdnURLOverride: "cdn.example.com" }}
        />,
      )
      .toJSON();

    expect(JSON.stringify(tab2Tree).includes("Tab 1")).toBe(false);
    expect(JSON.stringify(tab2Tree).includes("Tab 2")).toBe(true);
    expect(tab2Tree).toMatchSnapshot();
  });

  it.skip("should replace the CDN URL with the override (tree)", () => {
    const tree = renderer
      .create(
        <ArticleRenderer
          article={articleWithImageTree as Article}
          __experimentalFlags={{ cdnURLOverride: "cdn.example.com" }}
        />,
      )
      .toJSON();
    expect(JSON.stringify(tree).includes("https://cdn.example.com")).toBe(true);
    expect(JSON.stringify(tree).includes("https://cdn.staging.content")).toBe(
      false,
    );
    expect(tree).toMatchSnapshot();
  });
});
