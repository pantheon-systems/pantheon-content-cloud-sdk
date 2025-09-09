import {
  PantheonAPI,
  PantheonAPIOptions,
} from "@pantheon-systems/pcc-sdk-core";
import type { NextApiRequest, NextApiResponse } from "next";
import type { NextRequest } from "next/server";
import packageJson from "../../package.json";

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
      const nextReq = req as NextApiRequest;
      const nextRes = res as NextApiResponse;
      const command = nextReq.query.command?.toString();

      // Handle status requests here
      if (command === "status" && typeof api.buildStatus === "function") {
        const level =
          nextReq.query.level?.toString() === "debug" ? "debug" : "basic";
        const coreStatus = api.buildStatus(level);
        const platform = buildPlatformDiagnostics(
          level,
          "pages",
          packageJson.version,
        );
        const payload = { ...coreStatus, platform };
        return void nextRes.json(payload);
      }

      // Non-status flows: pass through to core
      return void (await api.handler(
        nextReq as NextApiRequest,
        nextRes as NextApiResponse,
      ));
    }

    // App router
    const appRouterParams = res as AppRouterParams;
    const nextReq = req as NextRequest;
    const command = nextReq.nextUrl.searchParams.get("command")?.split("/")[0];

    // Handle status requests here
    if (command === "status" && typeof api.buildStatus === "function") {
      const levelParam = nextReq.nextUrl.searchParams.get("level");
      const level = levelParam === "debug" ? "debug" : "basic";
      const coreStatus = api.buildStatus(level);
      const platform = buildPlatformDiagnostics(
        level,
        "app",
        packageJson.version,
      );
      const payload = { ...coreStatus, platform };
      return Response.json(payload);
    }

    // Non-status flows: pass through to core
    const headers = new Headers({
      ...((await appRouterParams.headers) || {}),
    });

    return (await api.handler(
      {
        query: {
          ...Object.fromEntries(nextReq.nextUrl.searchParams),
          ...(await appRouterParams.params),
        },
        cookies: cookiesToObj(nextReq.cookies),
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

function buildPlatformDiagnostics(
  _level: "basic" | "debug",
  routingMode: "app" | "pages",
  reactSdkVersion: string | null,
) {
  const runtime =
    typeof (globalThis as unknown as { EdgeRuntime?: unknown }).EdgeRuntime !==
    "undefined"
      ? "edge"
      : "node";

  const base = {
    name: "next",
    version: null as string | null,
    sdk: { name: "pcc-react-sdk", version: reactSdkVersion },
    routing: { mode: routingMode },
    runtime,
  };

  return base;
}
