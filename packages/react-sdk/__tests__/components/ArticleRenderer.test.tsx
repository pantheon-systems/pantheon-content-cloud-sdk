import { Article } from "@pantheon-systems/pcc-sdk-core/types";
import renderer from "react-test-renderer";
import { ArticleRenderer, getArticleTitle } from "../../src/components";
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

  it("should replace the CDN URL with the override (markdown with function)", () => {
    const tree = renderer
      .create(
        <ArticleRenderer
          article={articleWithImageMarkdown as Article}
          __experimentalFlags={{
            cdnURLOverride: (url) =>
              url.replace(
                /cdn\.staging\.content.pantheon.io\/[^/]+/,
                "cdn.example.com",
              ),
          }}
        />,
      )
      .toJSON();

    expect(
      JSON.stringify(tree).includes(
        "https://cdn.example.com/djHVTYbPaCby44H5CxhH",
      ),
    ).toBe(true);
    expect(
      JSON.stringify(tree).includes(
        "https://cdn.staging.content.pantheon.io/loAWY0YB0HTHexSzw3Z1/djHVTYbPaCby44H5CxhH",
      ),
    ).toBe(false);
    expect(tree).toMatchSnapshot();
  });

  it("should replace the CDN URL with the override (tree with function)", () => {
    const tree = renderer
      .create(
        <ArticleRenderer
          article={articleWithImageTree as Article}
          __experimentalFlags={{
            cdnURLOverride: (url) =>
              url.replace(
                /cdn\.staging\.content.pantheon.io\/[^/]+/,
                "cdn.example.com",
              ),
          }}
        />,
      )
      .toJSON();
    expect(
      JSON.stringify(tree).includes(
        "https://cdn.example.com/djHVTYbPaCby44H5CxhH",
      ),
    ).toBe(true);
    expect(
      JSON.stringify(tree).includes(
        "https://cdn.staging.content.pantheon.io/loAWY0YB0HTHexSzw3Z1/djHVTYbPaCby44H5CxhH",
      ),
    ).toBe(false);
    expect(tree).toMatchSnapshot();
  });
});
