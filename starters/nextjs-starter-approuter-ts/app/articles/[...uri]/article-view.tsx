import { PCCConvenienceFunctions } from "@pantheon-systems/pcc-sdk-core";
import { cookies } from "next/headers";
import { notFound, redirect, RedirectType } from "next/navigation";
import queryString from "query-string";
import { Tags } from "../../../components/tags";
import { pantheonAPIOptions } from "../../api/pantheoncloud/[...command]/api-options";
import ClientsideArticleView from "./clientside-articleview";

export const ArticleView = async ({ params, searchParams }) => {
  const { article, grant } = await getServersideArticle(params, searchParams);

  return (
    <>
      <ClientsideArticleView article={article} grant={grant} />
      <Tags tags={article?.tags} />
    </>
  );
};

export async function getServersideArticle(params, searchParams) {
  const { uri } = params;
  const { publishingLevel, pccGrant, ...query } = searchParams;

  const slugOrId = uri[uri.length - 1];
  const grant = pccGrant || cookies().get("PCC-GRANT")?.value || null;

  const article = await PCCConvenienceFunctions.getArticleBySlugOrId(
    slugOrId,
    publishingLevel?.toString().toUpperCase() || "PRODUCTION",
  );

  if (!article) {
    return notFound();
  }

  if (
    article.slug?.trim().length &&
    article.slug.toLowerCase() !== slugOrId?.trim().toLowerCase()
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
