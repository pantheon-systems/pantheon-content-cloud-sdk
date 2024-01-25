import {
  PantheonProvider,
  type Article,
} from "@pantheon-systems/pcc-react-sdk";
import { NextSeo } from "next-seo";
import queryString from "query-string";
import ArticleView from "../../../components/article-view";
import Layout from "../../../components/layout";
import { Tags } from "../../../components/tags";
import { getArticleBySlugOrId } from "../../../lib/Articles";
import { buildPantheonClientWithGrant } from "../../../lib/PantheonClient";
import { pantheonAPIOptions } from "../../api/pantheoncloud/[...command]";

interface ArticlePageProps {
  article: Article;
  grant: string;
}

export default function ArticlePage({ article, grant }: ArticlePageProps) {
  const seoMetadata = getSeoMetadata(article);

  return (
    <PantheonProvider client={buildPantheonClientWithGrant(grant)}>
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
          <ArticleView article={article} onlyContent={true} />

          <Tags tags={article?.tags} />
        </div>
      </Layout>
    </PantheonProvider>
  );
}

export async function getServerSideProps({
  req: { cookies },
  query: { uri, publishingLevel, pccGrant, ...query },
}) {
  const slugOrId = uri[uri.length - 1];
  const grant = pccGrant || cookies["PCC-GRANT"] || null;

  const article = await getArticleBySlugOrId(
    slugOrId,
    publishingLevel ? publishingLevel.toString().toUpperCase() : "PRODUCTION",
  );

  if (!article) {
    return {
      notFound: true,
    };
  }

  if (
    article.slug?.trim().length &&
    article.slug.toLowerCase() !== slugOrId?.trim().toLowerCase()
  ) {
    // If the article was accessed by the id rather than the slug - then redirect to the canonical
    // link (mostly for SEO purposes than anything else).
    return {
      redirect: {
        destination: queryString.stringifyUrl({
          url: pantheonAPIOptions.resolvePath(article),
          query: { publishingLevel, ...query },
        }),
        permanent: false,
      },
    };
  }

  return {
    props: {
      article,
      grant,
    },
  };
}

interface DateInputObject {
  msSinceEpoch: string;
}

function isDateInputObject(v: DateInputObject | unknown): v is DateInputObject {
  return (v as DateInputObject).msSinceEpoch != null;
}

const getSeoMetadata = (article) => {
  const tags = article.tags && article.tags.length > 0 ? article.tags : [];
  let authors = [];
  let publishedTime = null;

  // Collecting data from metadata fields
  Object.entries(article.metadata || {}).forEach(([key, val]) => {
    if (key.toLowerCase().trim() === "author" && val) authors = [val];
    else if (key.toLowerCase().trim() === "date" && isDateInputObject(val))
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
