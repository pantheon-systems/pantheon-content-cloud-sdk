import {
  PantheonAPI,
  PantheonAPIOptions,
} from "@pantheon-systems/pcc-sdk-core";
import type { NextApiRequest, NextApiResponse } from "next";
import type { NextRequest } from "next/server";

export interface AppRouterParams {
  params: Promise<Record<string, string>>;
  headers?: Promise<null>;
}

type Handler = {
  // In Pages routing, req and res are NextApiRequest and NextApiResponse
  (req: NextApiRequest, res: NextApiResponse): Promise<unknown>;
  // In App routing, req is NextRequest and the second argument is AppRouterParams
  (req: NextRequest, res: AppRouterParams): Promise<void | Response>;
};

export function NextPantheonAPI(options?: PantheonAPIOptions) {
  const api = PantheonAPI(options);

  const handler: Handler = async (req, res) => {
    if (isPagesRouterResponse(res)) {
      // Pages router
      // Intentionally voiding the return value, page router API routes should not return a value
      // https://github.com/vercel/next.js/discussions/48951
      return void (await api(req as NextApiRequest, res as NextApiResponse));
    }

    // App router
    const appRouterParams = res as AppRouterParams;
    const headers = new Headers({
      ...((await appRouterParams.headers) || {}),
    });

    return (await api(
      {
        query: {
          ...Object.fromEntries((req as NextRequest).nextUrl.searchParams),
          ...(await appRouterParams.params),
        },
        cookies: cookiesToObj((req as NextRequest).cookies),
      },
      {
        getHeader: (key) => headers.get(key) || "",
        setHeader: (key, value) => headers.set(key, value.toString()),
        redirect: (status, path) => {
          headers.set("Location", path);
          return new Response(null, {
            status,
            headers,
          });
        },
        json: (data) => {
          return Response.json(data, {
            headers,
          });
        },
      },
    )) as void | Response;
  };

  return handler;
}

function isPagesRouterResponse(
  res: AppRouterParams | NextApiResponse,
): res is NextApiResponse {
  // We can differentiate between app router vs pages api
  // by checking for params
  // reference: (https://github.com/nextauthjs/next-auth/blob/v4/packages/next-auth/src/next/index.ts)
  return res != null && typeof res === "object" && !("params" in res);
}

function cookiesToObj(cookies: NextRequest["cookies"]) {
  // Convert to name value pairs
  return cookies.getAll().reduce(
    (acc, cookie) => {
      acc[cookie.name] = cookie.value;
      return acc;
    },
    {} as Record<string, string>,
  );
}
