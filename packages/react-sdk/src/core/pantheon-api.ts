import { Article } from "@pantheon-systems/pcc-sdk-core/types";

interface ApiRequest {
  query: Record<string, string | string[]>;
  url: string;
}

interface ApiResponse {
  setHeader: (key: string, value: string) => void;
  redirect: (code: number, url: string) => void;
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
  resolvePath?: (article: Pick<Article, "id">) => string;
  /**
   * The path to redirect to if the article is not found.
   * Defaults to `/404`.
   */
  notFoundPath?: string;
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
      // TODO: We will almost definitely need to retrieve the whole article eventually, which will
      // require the PantheonClient to be passed into the options.
      const parsedArticle = {
        id: command[1],
      };

      const resolvedPath = options?.resolvePath
        ? options.resolvePath(parsedArticle)
        : defaultResolvePath(parsedArticle);

      res.redirect(
        302,
        resolvedPath +
          (publishingLevel && typeof publishingLevel === "string"
            ? `?publishingLevel=${encodeURIComponent(publishingLevel)}`
            : ""),
      );
    } else {
      res.redirect(301, options?.notFoundPath || "/404");
    }
  };
}
