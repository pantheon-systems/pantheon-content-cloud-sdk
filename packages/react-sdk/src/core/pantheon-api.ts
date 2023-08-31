import {
  getArticleBySlugOrId,
  PantheonClient,
  PantheonClientConfig,
} from "@pantheon-systems/pcc-sdk-core";
import { Article } from "@pantheon-systems/pcc-sdk-core/types";
import { SmartComponentMap } from "../components/ArticleRenderer";

interface ApiRequest {
  query: Record<string, string | string[]>;
  url: string;
}

interface ApiResponse {
  setHeader: (key: string, value: string) => void;
  redirect: (code: number, url: string) => void;
  json: (data: string | object | unknown) => void;
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
   */
  resolvePath?: (article: Partial<Article> & Pick<Article, "id">) => string;

  /**
   * Return the canonical path for previewing a component
   * given the component's name.
   */
  componentPreviewPath?: (componentName: string) => string;

  /**
   * The path to redirect to if the article is not found.
   * Defaults to `/404`.
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

export function PantheonAPI(options?: PantheonAPIOptions) {
  return async (req: ApiRequest, res: ApiResponse) => {
    // NextJS by default sets the allowed origin for /api/* routes as same origin only,
    // so we have to change it here to allow the external Pantheon system to access these APIs.
    res.setHeader("Access-Control-Allow-Origin", "*");

    const { command: commandInput, pccGrant, publishingLevel } = req.query;
    const command = Array.isArray(commandInput) ? commandInput : [commandInput];

    if (pccGrant) {
      res.setHeader(
        "Set-Cookie",
        `PCC-GRANT=${pccGrant}; Path=/; HttpOnly; SameSite=Strict`,
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
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              { publishingLevel: publishingLevel?.toString() as any },
            )
          : null;

      if (!article?.id) {
        throw new Error(
          `Article with ID or slug "${parsedArticleId}" not found`,
        );
      }

      const resolvedPath = options?.resolvePath
        ? options.resolvePath(article)
        : defaultResolvePath(article);

      res.redirect(
        302,
        resolvedPath +
          (publishingLevel && typeof publishingLevel === "string"
            ? `?publishingLevel=${encodeURIComponent(publishingLevel)}`
            : ""),
      );
    } else if (command[0] === "component_schema") {
      const componentFilter = command[1];

      if (options?.smartComponentMap == null) {
        return res.redirect(302, options?.notFoundPath || "/404");
      } else if (componentFilter == null) {
        // Return entire schema if no filter was given.
        return res.json(options?.smartComponentMap);
      } else {
        return res.json(
          options?.smartComponentMap[componentFilter.toUpperCase()],
        );
      }
    } else if (command[0] === "component" && options?.componentPreviewPath) {
      return res.redirect(302, options.componentPreviewPath(command[1]));
    } else {
      res.redirect(302, options?.notFoundPath || "/404");
    }
  };
}
