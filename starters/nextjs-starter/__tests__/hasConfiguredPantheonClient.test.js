import { getPanthonAPIOptions } from "../pages/api/pantheoncloud/[...command]";

describe("hasConfiguredPantheonClient", () => {
  // Define a dummy site
  const site = {
    id: "123",
    contentStructure: {
      active: [],
    },
  };

  it("Pantheon API options have been filled out", () => {
    expect(getPanthonAPIOptions(site).smartComponentMap.MEDIA_PREVIEW).toBeDefined();
  });

  it("Resolve document by article id", () => {
    expect(getPanthonAPIOptions(site).resolvePath({ id: 123 })).toBe("/articles/123");
  });

  it("Resolve document by article slug", () => {
    expect(getPanthonAPIOptions(site).resolvePath({ slug: "foo-bar-slug" })).toBe(
      "/articles/foo-bar-slug",
    );
  });

  it ("Resolve document to the right content structure path", () => {
    // Add content structure to the site
    site.contentStructure = {
      active: [
        {
          id: "category-1",
          name: "foo",
          type: "category",
          children: [
            {
              id: "nested-category-1",
              name: "bar",
              type: "category",
              children: [{ id: "123", name: "baz", type: "article" }],
            },
          ],
        },
      ],
    };
    expect(getPanthonAPIOptions(site).resolvePath({ id: "123", slug: "foo-bar-slug" })).toBe(
      "/articles/foo/bar/foo-bar-slug",
    );
  });
});
