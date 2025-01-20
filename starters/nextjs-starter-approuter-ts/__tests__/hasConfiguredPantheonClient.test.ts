import { Site } from "@pantheon-systems/pcc-react-sdk/*";
import { getPantheonAPIOptions } from "../app/api/pantheoncloud/[...command]/api-options";

describe("hasConfiguredPantheonClient", () => {
  // Define a dummy site
  const site: Site = {
    id: "123",
    name: "test",
    url: "https://test.com",
    domain: "test.com",
    tags: [],
    metadataFields: {},
    contentStructure: {
      active: [],
    },
  };

  it("Pantheon API options have been filled out", () => {
    expect(
      getPantheonAPIOptions(site).smartComponentMap.MEDIA_PREVIEW,
    ).toBeDefined();
  });

  it("Resolve document by article id", () => {
    expect(getPantheonAPIOptions(site).resolvePath({ id: "123" })).toBe(
      "/articles/123",
    );
  });

  it("Resolve document by article slug", () => {
    expect(
      getPantheonAPIOptions(site).resolvePath({
        id: "123",
        slug: "foo-bar-slug",
      }),
    ).toBe("/articles/foo-bar-slug");
  });

  it("Resolve document to the right content structure path", () => {
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
    expect(
      getPantheonAPIOptions(site).resolvePath({
        id: "123",
        slug: "foo-bar-slug",
      }),
    ).toBe("/articles/foo/bar/foo-bar-slug");
  });
});
