import { render } from "@testing-library/react";
import SSGISRExampleTemplate from "../../pages/examples/ssg-isr";

import articles from "../data/articles.json";

vi.mock("next/image");
vi.mock("next/router", () => ({
  useRouter: () => ({
    locale: "en",
  }),
}));

/**
 * @vitest-environment jsdom
 */

describe("<SSGISRExampleTemplate />", () => {
  it("should render with articles", () => {
    const { asFragment } = render(
      <SSGISRExampleTemplate articles={articles} />
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
