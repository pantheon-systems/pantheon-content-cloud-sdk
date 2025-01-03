import { PCCConvenienceFunctions } from "@pantheon-systems/pcc-react-sdk/server";
import { cookies } from "next/headers";
import { notFound, redirect, RedirectType } from "next/navigation";
import queryString from "query-string";
import { pantheonAPIOptions } from "../../api/pantheoncloud/[...command]/api-options";
import { ClientsideArticleView } from "./clientside-articleview";

export interface ArticleViewProps {
  params: { uri: string };
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

export async function getServersideArticle({
  params,
  searchParams,
}: ArticleViewProps) {
  const { uri } = params;
  const { publishingLevel, pccGrant, ...query } = searchParams;

  const slugOrId = uri[uri.length - 1];
  const grant = pccGrant || cookies().get("PCC-GRANT")?.value || null;

  const article = await PCCConvenienceFunctions.getArticleBySlugOrId(
    slugOrId,
    (publishingLevel?.toString().toUpperCase() as "PRODUCTION" | "REALTIME") ||
      "PRODUCTION",
  );

  if (!article) {
    return notFound();
  }

  if (
    article.slug?.trim().length &&
    article.slug.toLowerCase() !== slugOrId?.trim().toLowerCase() &&
    pantheonAPIOptions.resolvePath != null
  ) {
    // If the article was accessed by the id rather than the slug - then redirect to the canonical
    // link (mostly for SEO purposes than anything else).
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
  };
}
