import { pantheonAPIOptions } from "../pages/api/pantheoncloud/[...command]";

describe("hasConfiguredPantheonClient", () => {
  it("Pantheon API options have been filled out", () => {
    expect(pantheonAPIOptions.smartComponentMap.MEDIA_PREVIEW).toBeDefined();
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
