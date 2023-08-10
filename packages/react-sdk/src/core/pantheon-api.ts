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
  resolvePath?: (article: Pick<Article, "id">) => string;
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

    const { command: commandInput } = req.query;
    const command = Array.isArray(commandInput) ? commandInput : [commandInput];

    if (command[0] === "document") {
      // TODO: We will almost definitely need to retrieve the whole article eventually, which will
      // require the PantheonClient to be passed into the options.
      const parsedArticle = {
        id: command[1],
      };

      res.redirect(
        301,
        options?.resolvePath
          ? options.resolvePath(parsedArticle)
          : defaultResolvePath(parsedArticle),
      );
    } else {
      res.redirect(301, options?.notFoundPath || "/404");
    }
  };
}
