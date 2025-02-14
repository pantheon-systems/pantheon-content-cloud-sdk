import { pantheonAPIOptions } from "../pages/api/pantheoncloud/[...command]";

describe("hasConfiguredPantheonClient", () => {
  it("Pantheon API options have been filled out", () => {
    expect(pantheonAPIOptions.smartComponentMap?.MEDIA_PREVIEW).toBeDefined();
  });

  it("Resolve document by article id", () => {
    const site = {
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
    expect(pantheonAPIOptions.resolvePath({ id: "123" }, site)).toBe("/articles/123");
  });

  it("Resolve document by article slug", () => {
    const site = {
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
    expect(
      pantheonAPIOptions.resolvePath({ id: "123", slug: "foo-bar-slug" }, site),
    ).toBe("/articles/foo-bar-slug");
  });
});