import { render } from "@testing-library/react";
import ExamplesPageTemplate from "../../pages/examples/index";

vi.mock("next/image");
vi.mock("next/router", () => ({
  useRouter: () => ({
    locale: "en",
  }),
}));

/**
 * @vitest-environment jsdom
 */

describe("<ExamplesPageTemplate />", () => {
  it("should render the examples list page", () => {
    const { asFragment } = render(<ExamplesPageTemplate />);
    expect(asFragment()).toMatchSnapshot();
  });
});
