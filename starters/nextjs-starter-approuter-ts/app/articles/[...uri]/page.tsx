import { PCCConvenienceFunctions } from "@pantheon-systems/pcc-sdk-core";
import { cookies } from "next/headers";
import { notFound, redirect, RedirectType } from "next/navigation";
import queryString from "query-string";
import { Suspense } from "react";
import Layout from "../../../components/layout";
import { Tags } from "../../../components/tags";
import { pantheonAPIOptions } from "../../api/pantheoncloud/[...command]/api-options";
import ClientsideArticleView from "./clientside-articleview";

export default async function ArticlePage({ params, searchParams }) {
  const { article, grant } = await getServersideArticle(params, searchParams);

  return (
    <Layout>
      <div className="max-w-screen-lg mx-auto mt-16 prose">
        <Suspense>
          <ClientsideArticleView article={article} grant={grant} />
        </Suspense>

        <Tags tags={article?.tags} />
      </div>
    </Layout>
  );
}

async function getServersideArticle(params, searchParams) {
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

interface DateInputObject {
  msSinceEpoch: string;
}

function isDateInputObject(v: DateInputObject | unknown): v is DateInputObject {
  return (v as DateInputObject).msSinceEpoch != null;
}

export async function generateMetadata({ params, searchParams }) {
  const { article, grant } = await getServersideArticle(params, searchParams);
  const tags = article.tags && article.tags.length > 0 ? article.tags : [];
  let authors = [];
  let publishedTime = null;

  // Collecting data from metadata fields
  Object.entries(article.metadata || {}).forEach(([key, val]) => {
    if (key.toLowerCase().trim() === "author" && val) authors = [val];
    else if (key.toLowerCase().trim() === "date" && isDateInputObject(val))
      publishedTime = new Date(val.msSinceEpoch).toISOString();
  });

  const imageProperties = [
    article.metadata?.["Hero Image"],
    // Extend as needed
  ]
    .filter((url): url is string => typeof url === "string")
    .map((url) => ({ url }));

  const description = "Article hosted using Pantheon Content Cloud";

  return {
    title: article.title,
    description,
    openGraph: {
      type: "website",
      title: article.title,
      description,
      images: imageProperties,
      article: {
        authors,
        tags,
        ...(publishedTime && {
          publishedTime,
        }),
      },
    },
  };
}
