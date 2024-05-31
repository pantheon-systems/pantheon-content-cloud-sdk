import {
  PantheonAPI,
  PantheonAPIOptions,
} from "@pantheon-systems/pcc-sdk-core";
import type { NextApiRequest, NextApiResponse } from "next";
import type { NextRequest } from "next/server";

export interface AppRouterParams {
  params: Record<string, string>;
  headers?: null;
}

export function NextPantheonAPI(options?: PantheonAPIOptions) {
  const api = PantheonAPI(options);

  return async (
    // In Pages routing, req and res are NextApiRequest and NextApiResponse
    // In App routing, req is NextRequest and the second argument is AppRouterParams
    req: NextRequest | NextApiRequest,
    res: AppRouterParams | NextApiResponse,
  ) => {
    if (isPagesRouterResponse(res)) {
      // Pages routing
      return await api(req as NextApiRequest, res as NextApiResponse);
    }

    // App router
    const headers = new Headers({
      ...(res.headers || {}),
    });

    return await api(
      {
        query: {
          ...Object.fromEntries((req as NextRequest).nextUrl.searchParams),
          ...res.params,
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
    );
  };
}

function isPagesRouterResponse(
  res: AppRouterParams | NextApiResponse,
): res is NextApiResponse {
  // We can differentiate between app router vs pages api
  // by checking for params
  // reference: (https://github.com/nextauthjs/next-auth/blob/v4/packages/next-auth/src/next/index.ts)
  // @ts-expect-error - This is the point of the type guard
  return !res?.params;
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
