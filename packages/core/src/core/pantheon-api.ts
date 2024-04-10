import queryString from "query-string";
import { getArticleBySlugOrId, PCCConvenienceFunctions } from "../helpers";
import { parseJwt } from "../lib/jwt";
import { Article, SmartComponentMap } from "../types";
import { PantheonClient, PantheonClientConfig } from "./pantheon-client";

export interface ApiRequest {
  /**
   * The query string parameters.
   */
  query: Record<string, string | string[]> & {
    command: string | string[];
  };

  url: string;
}

export interface ApiResponse {
  /**
   * Function to set a header on the api response.
   */
  setHeader: (key: string, value: string) => Promise<unknown> | unknown;
  /**
   * Function to return a redirect response.
   */
  redirect: (code: number, url: string) => Promise<unknown> | unknown;
  /**
   * Function to return a JSON response.
   */
  json: (data: string | object | unknown) => Promise<unknown> | unknown;
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

export const PantheonAPI = (givenOptions?: PantheonAPIOptions) => {
  const options: PantheonAPIOptions = {
    ...defaultOptions,
    ...givenOptions,
  };

  return async (req: Request, { params }: any) => {
    const headers: any = {};
    // Allow the external Pantheon system to access these API routes.
    headers["Access-Control-Allow-Origin"] = "*";

    console.log({ headers, req, params });
    const {
      command: commandInput,
      pccGrant,
      ...restOfQuery
    } = req.query || params;

    const { publishingLevel } = restOfQuery;
    const command = Array.isArray(commandInput)
      ? commandInput
      : typeof commandInput === "string"
      ? commandInput.split("/")
      : [commandInput];

    if (pccGrant) {
      headers["Set-Cookie"] = `PCC-GRANT=${pccGrant}; Path=/; SameSite=Lax`;
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
          headers[
            "Set-Cookie"
          ] = `PCC-GRANT=deleted; Path=/; SameSite=Lax; Expires=Thu, 01 Jan 1970 00:00:00 GMT`;
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
        await getArticleBySlugOrId(
          options.getPantheonClient!({
            pccGrant: pccGrant ? pccGrant.toString() : undefined,
          }),
          parsedArticleId,
          // We will let downstream validate the publishingLevel param.
          {
            publishingLevel: publishingLevel
              ?.toString()
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              .toUpperCase() as any,
          },
        );

      if (article == null) {
        return Response.redirect(
          new URL(options?.notFoundPath || "/404", req.url),
          302,
        );
      }

      const resolvedPath = options?.resolvePath
        ? options.resolvePath(article)
        : defaultOptions.resolvePath(article);

      return Response.redirect(
        new URL(
          resolvedPath +
            (publishingLevel && typeof publishingLevel === "string"
              ? `?publishingLevel=${encodeURIComponent(
                  publishingLevel,
                ).toUpperCase()}`
              : ""),
          req.url,
        ),
        302,
      );
    } else if (command[0] === "component_schema") {
      const componentFilter = command[1];

      if (options?.smartComponentMap == null) {
        return Response.redirect(
          new URL(options?.notFoundPath || "/404", req.url),
          302,
        );
      } else if (componentFilter == null) {
        // Return entire schema if no filter was given.
        return Response.json(options?.smartComponentMap, { headers });
      } else {
        return Response.json(
          options?.smartComponentMap[componentFilter.toUpperCase()],
          { headers },
        );
      }
    } else if (command[0] === "component" && options?.componentPreviewPath) {
      const previewPath = options.componentPreviewPath(command[1]);
      const pathParts = previewPath.split("?");
      const query = queryString.parse(pathParts[1] || "");

      return Response.redirect(
        new URL(
          `${pathParts[0]}?${queryString.stringify({
            ...restOfQuery,
            ...query,
          })}`,
          req.url,
        ),
        302,
      );
    } else {
      return Response.redirect(
        new URL(options?.notFoundPath || "/404", req.url),
        302,
      );
    }
  };
};
