import queryString from "query-string";
import { getArticleBySlugOrId, PCCConvenienceFunctions } from "../helpers";
import { parseJwt } from "../lib/jwt";
import { Article, SmartComponentMap } from "../types";
import { PantheonClient, PantheonClientConfig } from "./pantheon-client";

export interface ApiRequest {
  /**
   * The query string parameters.
   */
  query: Record<string, string | string[] | undefined>;

  url: string;

  cookies?: Record<string, string | string[] | undefined>;

  headers?: Record<string, string> | undefined;

  connection?: {
    encrypted?: boolean;
  };
}

type HeaderValue = string | string[] | number | undefined;

type Options = {
  headers?: Headers;
  status?: number;
};

export interface ApiResponse {
  /**
   * Function to set a header on the api response.
   */
  setHeader: (
    key: string,
    value: string | string[],
  ) => Promise<ApiResponse> | unknown;
  /**
   * Function to get a header set on the api response.
   */
  getHeader: (key: string) => HeaderValue | Promise<HeaderValue>;
  /**
   * Function to return a redirect response.
   */
  redirect: (url: string, options: Options) => Promise<ApiResponse> | unknown;
  /**
   * Function to return a JSON response.
   */
  json: (
    data: string | object | unknown,
    options: Options,
  ) => Promise<ApiResponse> | unknown;

  headers: Record<string, string>;
  params?: undefined;
}

export interface AppRouterParams {
  params: Record<string, string>;
  headers?: null;
}

export interface PantheonAPIOptions {
  /**
   * A function that takes a PCC article ID and returns the path on your site
   * where the article is hosted.
   *
   * @example
   * // For a blog with articles hosted at /posts this function will be
   * (article) => `/posts/${article.id}`
   *
   * @default (article) => `/articles/${article.id}` (if not provided)
   *
   */
  resolvePath?: (article: Partial<Article> & Pick<Article, "id">) => string;

  /**
   * A function which returns the PCC site id currently in use.
   */
  getSiteId?: () => string;

  /**
   * Return the canonical path for previewing a component
   * given the component's name.
   */
  componentPreviewPath?: (componentName: string) => string;

  /**
   * The path to redirect to if the article is not found.
   * @default "/404"
   */
  notFoundPath?: string;

  /**
   * A function which can be called in order to retrieve
   * a PantheonClient instance. It is only called as needed.
   *
   */
  getPantheonClient?: (props?: Partial<PantheonClientConfig>) => PantheonClient;

  /**
   * Map of type to React smart components.
   */
  smartComponentMap?: SmartComponentMap;
}

const defaultOptions = {
  getPantheonClient: (props?: Partial<PantheonClientConfig>) =>
    PCCConvenienceFunctions.buildPantheonClient({
      isClientSide: false,
      ...props,
    }),
  resolvePath: (article: Partial<Article> & Pick<Article, "id">) =>
    `/articles/${article.id}`,
  // eslint-disable-next-line turbo/no-undeclared-env-vars
  getSiteId: () => process.env.PCC_SITE_ID as string,
} satisfies PantheonAPIOptions;

function generateBaseURL(req: ApiRequest) {
  try {
    // Return req.url if it can be parsed as a URL by itself.
    new URL(req.url);
    return req.url;
  } catch (e) {
    // Otherwise, try to construct it from the request headers.

    // If this is a forwarded request, use the protocol and host from the headers.
    if (req.headers?.["x-forwarded-host"]) {
      return `${
        req.headers["x-forwarded-proto"] || req.connection?.encrypted
          ? "https"
          : "http"
      }://${req.headers["x-forwarded-host"]}`;
    }

    // Otherwise, use the host header.
    return req.headers?.host
      ? `${req.connection?.encrypted ? "https" : "http"}://${req.headers.host}`
      : null;
  }
}

type AllowablePublishingLevels = "PRODUCTION" | "REALTIME" | undefined;

export const PantheonAPI = (givenOptions?: PantheonAPIOptions) => {
  const options: PantheonAPIOptions = {
    ...defaultOptions,
    ...givenOptions,
  };

  const internalHandler = async (
    req: ApiRequest,
    { params, ...res }: ApiResponse | AppRouterParams,
  ) => {
    if (!options.notFoundPath) {
      options.notFoundPath = "/404";
    }

    const headers = new Headers({
      ...(res.headers || []),
      // Allow the external Pantheon system to access these API routes.
      "Access-Control-Allow-Origin": "*",
    });

    const baseUrl = generateBaseURL(req);
    const query =
      req.query != null
        ? req.query
        : queryString.parse(req.url.split("?")[1] || "");

    const {
      command: commandInput,
      pccGrant,
      ...restOfQuery
    }: {
      command?: string | undefined | null;
      pccGrant?: string | undefined | null;
    } & { [k: string]: string | string[] | undefined | null } = {
      ...(query as Record<string, string>),
      ...params,
    };

    const { publishingLevel } = restOfQuery;

    if (!commandInput) {
      headers.set(
        "location",
        baseUrl
          ? new URL(options.notFoundPath, baseUrl).toString()
          : options.notFoundPath,
      );

      return new Response(null, {
        status: 302,
        headers,
      });
    }

    const command = Array.isArray(commandInput)
      ? commandInput
      : typeof commandInput === "string"
      ? commandInput.split("/")
      : [commandInput];

    if (pccGrant) {
      setCookie(headers, `PCC-GRANT=${pccGrant}; Path=/; SameSite=Lax`);
    } else if (
      options?.getSiteId != null &&
      req.cookies?.["PCC-GRANT"] != null
    ) {
      try {
        const resolvedSiteId = options.getSiteId();
        const pccGrantFromCookie = parseJwt(
          req.cookies["PCC-GRANT"].toString(),
        );

        // Remove the grant cookie if it was set for a different site.
        if (
          resolvedSiteId != null &&
          // Only apply this auto-delete logic if the grant was created with a siteid.
          pccGrantFromCookie.siteId != null &&
          pccGrantFromCookie.siteId !== resolvedSiteId
        ) {
          setCookie(
            headers,
            `PCC-GRANT=deleted; Path=/; SameSite=Lax; Expires=Thu, 01 Jan 1970 00:00:00 GMT`,
          );
        }
      } catch (e) {
        // eslint-disable-next-line no-empty
      }
    }

    if (command[0] === "status") {
      const smartComponentStatus = {
        smartComponents: Boolean(options?.smartComponentMap),
        smartComponentPreview: Boolean(options?.componentPreviewPath),
      };

      return Response.json(smartComponentStatus, { headers });
    }

    if (command[0] === "document") {
      const parsedArticleId = command[1];

      const article: (Partial<Article> & Pick<Article, "id">) | null =
        parsedArticleId == null
          ? null
          : await getArticleBySlugOrId(
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              options.getPantheonClient!({
                pccGrant: pccGrant ? pccGrant.toString() : undefined,
              }),
              parsedArticleId,
              // We will let downstream validate the publishingLevel param.
              {
                publishingLevel: publishingLevel
                  ?.toString()
                  .toUpperCase() as AllowablePublishingLevels,
              },
            );

      if (article == null) {
        headers.set(
          "location",
          baseUrl
            ? new URL(options.notFoundPath, baseUrl).toString()
            : options.notFoundPath,
        );

        return new Response(null, {
          status: 302,
          headers,
        });
      }

      const resolvedPath = options?.resolvePath
        ? options.resolvePath(article)
        : defaultOptions.resolvePath(article);
      const path =
        resolvedPath +
        (publishingLevel && typeof publishingLevel === "string"
          ? `?publishingLevel=${encodeURIComponent(
              publishingLevel,
            ).toUpperCase()}`
          : "");

      headers.set(
        "location",
        baseUrl ? new URL(path, baseUrl).toString() : path,
      );

      return new Response(null, {
        status: 302,
        headers,
      });
    } else if (command[0] === "component_schema") {
      const componentFilter = command[1];

      if (options?.smartComponentMap == null) {
        headers.set(
          "location",
          baseUrl
            ? new URL(options.notFoundPath, baseUrl).toString()
            : options.notFoundPath,
        );

        return new Response(null, {
          status: 302,
          headers,
        });
      } else if (componentFilter == null) {
        // Return entire schema if no filter was given.
        return Response.json(options?.smartComponentMap, { headers });
      } else {
        return Response.json(
          options?.smartComponentMap[componentFilter.toUpperCase()],
          { headers },
        );
      }
    } else if (
      command[0] === "component" &&
      options?.componentPreviewPath &&
      command[1] != null
    ) {
      const previewPath = options.componentPreviewPath(command[1]);
      const pathParts = previewPath.split("?");
      const query = queryString.parse(pathParts[1] || "");
      const path = `${pathParts[0]}?${queryString.stringify({
        ...restOfQuery,
        ...query,
      })}`;

      headers.set(
        "location",
        baseUrl ? new URL(path, baseUrl).toString() : path,
      );
      return new Response(null, {
        status: 302,
        headers,
      });
    } else {
      headers.set(
        "location",
        baseUrl
          ? new URL(options.notFoundPath, baseUrl).toString()
          : options.notFoundPath,
      );
      return new Response(null, {
        status: 302,
        headers,
      });
    }
  };

  return async (req: unknown, res: ApiResponse | AppRouterParams) => {
    const response = await internalHandler(req as ApiRequest, res);

    // We can differentiate between app router vs pages api
    // by checking for params
    // reference: (https://github.com/nextauthjs/next-auth/blob/v4/packages/next-auth/src/next/index.ts)
    if (res?.params) {
      return response;
    } else {
      response.headers.forEach((v, k) => {
        res.setHeader(k, v);
      });

      const location = response.headers.get("location");

      // Redirect HTTP status codes exist between 300 - 308 inclusive.
      if (
        response.status >= 300 &&
        response.status <= 308 &&
        location != null
      ) {
        return res.redirect(location, {
          status: response.status,
          headers: response.headers,
        });
      } else {
        return res.json(await response.json(), {
          status: response.status,
          headers: response.headers,
        });
      }
    }
  };
};

function setCookie(headers: Headers, value: string) {
  const previous = headers.get("Set-Cookie");

  headers.set(
    `Set-Cookie`,
    [
      ...(typeof previous === "string"
        ? [previous]
        : Array.isArray(previous)
        ? previous
        : []),
      value,
    ].join("; "),
  );
}
