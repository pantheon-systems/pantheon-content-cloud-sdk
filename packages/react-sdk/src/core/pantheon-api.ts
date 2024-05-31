import {
  PantheonAPI,
  PantheonAPIOptions,
} from "@pantheon-systems/pcc-sdk-core";
import type { NextApiRequest, NextApiResponse } from "next";

export interface AppRouterParams {
  params: Record<string, string>;
  headers?: null;
}

type Options = {
  headers?: Headers;
  status?: number;
};

type Handler =
  | ((req: NextApiRequest, res: NextApiResponse) => Promise<void>)
  | ((req: Request, res: Response) => Promise<Response>);

export function NextPantheonAPI(options?: PantheonAPIOptions) {
  const api = PantheonAPI(options);

  return async (
    // In Pages routing, req and res are NextApiRequest and NextApiResponse
    // In App routing, req and res are Request and Response
    req: Request | NextApiRequest,
    res: Response | NextApiResponse,
  ) => {
    if (isPagesRouterResponse(res) && isPagesRouterRequest(req)) {
      return await api(req, res);
    }

    // if (res?.params) {
    //   return response;
    // } else {
    //   response.headers.forEach((v, k) => {
    //     res.setHeader(k, v);
    //   });

    //   const location = response.headers.get("location");

    //   // Redirect HTTP status codes exist between 300 - 308 inclusive.
    //   if (
    //     response.status >= 300 &&
    //     response.status <= 308 &&
    //     location != null
    //   ) {
    //     res.redirect(location, {
    //       status: response.status,
    //       headers: response.headers,
    //     });
    //   } else {
    //     res.json(await response.json(), {
    //       status: response.status,
    //       headers: response.headers,
    //     });
    //   }
    // }
  };
}

function isPagesRouterResponse(
  res: Response | NextApiResponse,
): res is NextApiResponse {
  // We can differentiate between app router vs pages api
  // by checking for params
  // reference: (https://github.com/nextauthjs/next-auth/blob/v4/packages/next-auth/src/next/index.ts)
  // @ts-expect-error - This is the point of the type guard
  return !res?.params;
}

function isPagesRouterRequest(
  req: Request | NextApiRequest,
): req is NextApiRequest {
  // We can differentiate between app router vs pages api
  // by checking for cookies, Next unwraps cookies from the headers in
  // Pages routing
  // @ts-expect-error - This is the point of the type guard
  return Boolean(req?.cookies);
}
