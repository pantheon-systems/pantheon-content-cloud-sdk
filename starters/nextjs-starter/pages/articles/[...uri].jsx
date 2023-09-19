import { ArticleRenderer } from "@pantheon-systems/pcc-react-sdk/components";
import { NextSeo } from "next-seo";
import queryString from "query-string";
import Layout from "../../components/layout";
import { Tags } from "../../components/tags";
import { getArticleBySlugOrId } from "../../lib/Articles";
import { pantheonAPIOptions } from "../api/pantheoncloud/[...command]";

const getSeoMetadata = (article) => {
  const tags = article.tags && article.tags.length > 0 ? article.tags : [];
  let authors = [];
  let publishedTime = null;

  // Collecting data from metadata fields
  Object.entries(article.metadata || {}).forEach(([key, val]) => {
    if (key.toLowerCase().trim() === "author" && val) authors = [val];
    else if (key.toLowerCase().trim() === "date" && val.msSinceEpoch)
      publishedTime = new Date(val.msSinceEpoch).toISOString();
  });
  return {
    title: article.title,
    description: "Article hosted using Pantheon Content Cloud",
    tags,
    authors,
    publishedTime,
  };
};

export default function PageTemplate({ article }) {
  const seoMetadata = getSeoMetadata(article);
  return (
    <Layout>
      <NextSeo
        title={seoMetadata.title}
        description={seoMetadata.description}
        openGraph={{
          type: "website",
          title: seoMetadata.title,
          description: seoMetadata.description,
          article: {
            authors: seoMetadata.authors,
            tags: seoMetadata.tags,
            ...(seoMetadata.publishedTime && {
              publishedTime: seoMetadata.publishedTime,
            }),
          },
        }}
      />

      <div className="max-w-screen-lg mx-auto mt-16 prose">
        <ArticleRenderer
          article={article}
          renderTitle={(titleElement) => (
            <div>
              <h1 className="text-3xl font-bold md:text-4xl">{titleElement}</h1>

              {article.updatedAt ? (
                <p className="py-2">
                  Last Updated:{" "}
                  {new Date(article.updatedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              ) : null}

              <hr className="mt-6 mb-8" />
            </div>
          )}
          smartComponentMap={pantheonAPIOptions.smartComponentMap}
        />
        <Tags tags={article?.tags} />
      </div>
    </Layout>
  );
}

export async function getServerSideProps({
  req: { cookies },
  query: { uri, publishingLevel, ...query },
}) {
  const slugOrId = uri[uri.length - 1];
  const article = await getArticleBySlugOrId(
    slugOrId,
    cookies["PCC-GRANT"],
    publishingLevel ? publishingLevel.toString().toUpperCase() : "PRODUCTION",
  );

  if (!article) {
    return {
      notFound: true,
    };
  } else if (
    article.slug?.trim().length &&
    article.slug.toLowerCase() !== slugOrId?.trim().toLowerCase()
  ) {
    // If the article was accessed by the id rather than the slug - then redirect to the canonical
    // link (mostly for SEO purposes than anything else).
    return {
      redirect: {
        destination: `${pantheonAPIOptions.resolvePath(article)}?${
          query ? queryString.stringify(query) : ""
        }#`,
        permanent: false,
      },
    };
  }

  if (!article) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      article,
    },
  };
}
