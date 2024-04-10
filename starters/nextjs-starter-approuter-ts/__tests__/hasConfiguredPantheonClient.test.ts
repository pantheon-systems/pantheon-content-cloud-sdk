import { pantheonAPIOptions } from "../app/api/pantheoncloud/[...command]/route";

describe("hasConfiguredPantheonClient", () => {
  it("Pantheon API options have been filled out", () => {
    expect(pantheonAPIOptions.smartComponentMap.LEAD_CAPTURE).toBeDefined();
  });

  it("Resolve document by article id", () => {
    expect(pantheonAPIOptions.resolvePath({ id: 123 })).toBe("/articles/123");
  });

  it("Resolve document by article slug", () => {
    expect(pantheonAPIOptions.resolvePath({ slug: "foo-bar-slug" })).toBe(
      "/articles/foo-bar-slug",
    );
  });
});
