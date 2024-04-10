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

  cookies?: Record<string, string | string[] | undefined>;
}

type HeaderValue = string | string[] | number | undefined;

export interface ApiResponse {
  /**
   * Function to set a header on the api response.
   */
  setHeader: (
    key: string,
    value: string | string[],
  ) => Promise<unknown> | unknown;
  /**
   * Function to get a header set on the api response.
   */
  getHeader: (key: string) => HeaderValue | Promise<HeaderValue>;
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

export const PantheonAPI =
  (givenOptions?: PantheonAPIOptions) =>
  async (req: ApiRequest, res: ApiResponse) => {
    const options: PantheonAPIOptions = {
      ...defaultOptions,
      ...givenOptions,
    };

    // Allow the external Pantheon system to access these API routes.
    await res.setHeader("Access-Control-Allow-Origin", "*");

    const { command: commandInput, pccGrant, ...restOfQuery } = req.query;
    const { publishingLevel } = restOfQuery;

    if (!commandInput) {
      res.redirect(302, options?.notFoundPath || "/404");
      return;
    }

    const command = Array.isArray(commandInput)
      ? commandInput
      : typeof commandInput === "string"
      ? commandInput.split("/")
      : [commandInput];

    if (pccGrant) {
      await setCookie(res, `PCC-GRANT=${pccGrant}; Path=/; SameSite=Lax`);
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
          await setCookie(
            res,
            `PCC-GRANT=deleted; Path=/; SameSite=Lax; Expires=Thu, 01 Jan 1970 00:00:00 GMT`,
          );
        }
      } catch (e) {
        // eslint-disable-next-line no-empty
      }
    }

    if (command[0] === "status") {
      const status = {
        smartComponents: Boolean(options?.smartComponentMap),
        smartComponentPreview: Boolean(options?.componentPreviewPath),
      };

      return await res.json(status);
    }

    if (command[0] === "document") {
      const parsedArticleId = command[1];

      const article: (Partial<Article> & Pick<Article, "id">) | null =
        options?.getPantheonClient
          ? await getArticleBySlugOrId(
              options?.getPantheonClient({
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
            )
          : null;

      if (article == null) {
        return res.redirect(302, options?.notFoundPath || "/404");
      }

      const resolvedPath = options?.resolvePath
        ? options.resolvePath(article)
        : defaultOptions.resolvePath(article);

      return await res.redirect(
        302,
        resolvedPath +
          (publishingLevel && typeof publishingLevel === "string"
            ? `?publishingLevel=${encodeURIComponent(
                publishingLevel,
              ).toUpperCase()}`
            : ""),
      );
    } else if (command[0] === "component_schema") {
      const componentFilter = command[1];

      if (options?.smartComponentMap == null) {
        return await res.redirect(302, options?.notFoundPath || "/404");
      } else if (componentFilter == null) {
        // Return entire schema if no filter was given.
        return await res.json(options?.smartComponentMap);
      } else {
        return await res.json(
          options?.smartComponentMap[componentFilter.toUpperCase()],
        );
      }
    } else if (command[0] === "component" && options?.componentPreviewPath) {
      const previewPath = options.componentPreviewPath(command[1]);
      const pathParts = previewPath.split("?");
      const query = queryString.parse(pathParts[1] || "");

      return await res.redirect(
        302,
        `${pathParts[0]}?${queryString.stringify({
          ...restOfQuery,
          ...query,
        })}`,
      );
    } else {
      return await res.redirect(302, options?.notFoundPath || "/404");
    }
  };

async function setCookie(res: ApiResponse, value: string) {
  const previous = res.getHeader("Set-Cookie");

  await res.setHeader(`Set-Cookie`, [
    ...(typeof previous === "string"
      ? [previous]
      : Array.isArray(previous)
      ? previous
      : []),
    value,
  ]);
}
