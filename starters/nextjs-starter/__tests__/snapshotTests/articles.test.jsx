import { render } from "@testing-library/react";
import ArticlesListTemplate from "../../pages/articles/index";
import ArticlePageTemplate from "../../pages/articles/[...uri]";

import articles from "../data/articles.json";
import article from "../data/article.json";

vi.mock("next/image");
vi.mock("next/router", () => ({
  useRouter: () => ({
    locale: "en",
    pathname: "test/path",
    push: vi.fn(),
    query: {
      slug: "/articles/[slug]",
    },
  }),
}));

/**
 * @vitest-environment jsdom
 */

describe("<PostListTemplate />", () => {
  it("should render with posts", () => {
    const { asFragment } = render(<ArticlesListTemplate articles={articles} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
describe("<PostTemplate />", () => {
  it("should render a post", () => {
    const { asFragment } = render(<ArticlePageTemplate article={article} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
