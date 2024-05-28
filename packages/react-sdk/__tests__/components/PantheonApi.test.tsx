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

    const mockRes = {
      redirect: jest.fn(),
      setHeader: jest.fn(),
      json: jest.fn(),
      getHeader: jest.fn(),
    };

    await PantheonAPI({
      resolvePath: (article) => `/articles/${article.slug || article.id}`,
      componentPreviewPath: (x) => `/components/${x}`,
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

    const redirectArgs = mockRes.redirect.mock.calls[0];
    expect(redirectArgs[0]).toEqual(
      "/components/LEAD_CAPTURE?height=650&width=500",
    );
    expect(redirectArgs[1].status).toEqual(302);
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

    const mockRes = {
      redirect: jest.fn(),
      setHeader: jest.fn(),
      json: jest.fn(),
      getHeader: jest.fn(),
    };

    await PantheonAPI({
      resolvePath: (article) => `/articles/${article.slug || article.id}`,
      componentPreviewPath: (x) => `/components/${x}`,
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

    const redirectArgs = mockRes.redirect.mock.calls[0];
    expect(redirectArgs[0]).toEqual(
      "/components/LEAD_CAPTURE?height=650&width=500",
    );
    expect(redirectArgs[1].status).toEqual(302);
  });
});
