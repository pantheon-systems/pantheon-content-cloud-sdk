import queryString from "query-string";
import { getArticleBySlugOrId } from "../helpers";
import { Article, SmartComponentMap } from "../types";
import { PantheonClient, PantheonClientConfig } from "./pantheon-client";

export interface ApiRequest {
  /**
   * The query string parameters.
   */
  query: Record<string, string | string[]> & {
    command: string;
  };
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

function defaultResolvePath(article: Pick<Article, "id">) {
  return `/articles/${article.id}`;
}

export const PantheonAPI =
  (options?: PantheonAPIOptions) =>
  async (req: ApiRequest, res: ApiResponse) => {
    // Allow the external Pantheon system to access these API routes.
    await res.setHeader("Access-Control-Allow-Origin", "*");

    const { command: commandInput, pccGrant, ...restOfQuery } = req.query;
    const { publishingLevel } = restOfQuery;
    const command = Array.isArray(commandInput)
      ? commandInput
      : typeof commandInput === "string"
      ? commandInput.split("/")
      : [commandInput];

    if (pccGrant) {
      await res.setHeader(
        "Set-Cookie",
        `PCC-GRANT=${pccGrant}; Path=/; SameSite=Strict`,
      );
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
        : defaultResolvePath(article);

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
