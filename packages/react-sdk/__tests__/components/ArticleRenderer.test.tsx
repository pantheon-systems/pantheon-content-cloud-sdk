import { Article } from "@pantheon-systems/pcc-sdk-core/types";
import renderer from "react-test-renderer";
import { ArticleRenderer, getArticleTitle } from "../../src/components";
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
});
