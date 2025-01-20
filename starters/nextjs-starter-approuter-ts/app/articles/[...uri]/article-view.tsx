import { PCCConvenienceFunctions, Site } from "@pantheon-systems/pcc-react-sdk/server";
import { cookies } from "next/headers";
import { notFound, redirect, RedirectType } from "next/navigation";
import queryString from "query-string";
import { getPantheonAPIOptions } from "../../api/pantheoncloud/[...command]/api-options";
import { ClientsideArticleView } from "./clientside-articleview";
import {
  getArticlePathFromContentStrucuture,
  getSeoMetadata,
} from "../../../lib/utils";


export interface ArticleViewProps {
  params: { uri: string[] };
  searchParams: {
    publishingLevel: "PRODUCTION" | "REALTIME";
    pccGrant: string | undefined;
  };
}

export const ArticleView = async ({
  params,
  searchParams,
}: ArticleViewProps) => {
  const { article, grant } = await getServersideArticle({
    params,
    searchParams,
  });

  return <ClientsideArticleView article={article} grant={grant || undefined} />;
};

interface GetServersideArticleProps {
  params: { uri: string[] };
  searchParams: {
    publishingLevel: "PRODUCTION" | "REALTIME";
    pccGrant: string | undefined;
  };
}

export async function getServersideArticle({
  params,
  searchParams,
}: GetServersideArticleProps) {
  const { uri } = params;
  const { publishingLevel, pccGrant, ...query } = searchParams;

  const slugOrId = uri[uri.length - 1];
  const grant = pccGrant || cookies().get("PCC-GRANT")?.value || null;

  // Fetch the article and site in parallel
  const [article, site] = await Promise.all([
    PCCConvenienceFunctions.getArticleBySlugOrId(
      slugOrId,
      (publishingLevel?.toString().toUpperCase() as "PRODUCTION" | "REALTIME") ||
        "PRODUCTION",
    ),
    PCCConvenienceFunctions.getSite(),
  ]);

  if (!article) {
    return notFound();
  }

    // Get the article path from the content structure
    const articlePath = getArticlePathFromContentStrucuture(article, site);

    // Get the pantheonAPIOptions
    const pantheonAPIOptions = getPantheonAPIOptions(site);

  if (
    ((article.slug?.trim().length &&
    article.slug.toLowerCase() !== slugOrId?.trim().toLowerCase())||
    articlePath.length !== uri.length - 1 ||
    articlePath.join("/") !== uri.slice(0, -1).join("/")) &&
    pantheonAPIOptions.resolvePath != null
  ) {
    // If the article was accessed by the id rather than the slug - then redirect to the canonical
    // link (mostly for SEO purposes than anything else).
    // If the article path is not the same as the uri ie. if it is being accessed by a path without the content structure
    // then redirect to the canonical link.
    redirect(
      queryString.stringifyUrl({
        url: pantheonAPIOptions.resolvePath(article),
        query: { publishingLevel, ...query },
      }),
      RedirectType.replace,
    );
  }

  return {
    article,
    grant,
    site,
  };
}
