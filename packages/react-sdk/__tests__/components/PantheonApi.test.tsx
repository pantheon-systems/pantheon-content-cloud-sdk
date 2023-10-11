/* eslint-disable @typescript-eslint/no-explicit-any */
import { PantheonAPI } from "../../src";

describe("PantheonApi", () => {
  it("should pass on component variables in redirect", async () => {
    const mockReq = {
      url: "/components",
      query: {
        command: ["component", "LEAD_CAPTURE"],
        width: "500",
        height: "650",
      },
      redirect: jest.fn(),
    };
    const mockRes = {};

    await PantheonAPI({
      resolvePath: (article) => `/articles/${article.slug || article.id}`,
      smartComponentMap: {
        LEAD_CAPTURE: {
          title: "Lead Capture Form",
          iconUrl: null,
          fields: {
            title: { displayName: "Title", required: true, type: "string" },
            body: { displayName: "Body", required: false, type: "string" },
          },
        },
      },
    })(mockReq, mockRes as any);

    expect(mockReq.redirect).toBeCalledWith(301, "/components/");
  });

  it("should pass on component variables in redirect", async () => {
    const mockReq = {
      url: "/components",
      query: {
        command: ["component", "LEAD_CAPTURE"],
        width: "500",
        height: "650",
      },
      redirect: jest.fn(),
    };
    const mockRes = {};

    await PantheonAPI({
      resolvePath: (article) => `/articles/${article.slug || article.id}`,
      smartComponentMap: {
        LEAD_CAPTURE: {
          title: "Lead Capture Form",
          iconUrl: null,
          fields: {
            title: { displayName: "Title", required: true, type: "string" },
            body: { displayName: "Body", required: false, type: "string" },
          },
        },
      },
    })(mockReq, mockRes as any);

    expect(mockReq.redirect).toBeCalledWith(301, "/components/");
  });
});
