import {
  Article,
  PCCConvenienceFunctions,
} from "@pantheon-systems/pcc-react-sdk";
import { NextSeo } from "next-seo";
import queryString from "query-string";
import ArticleList from "../../../components/article-list";
import Layout from "../../../components/layout";
import { PAGE_SIZE } from "../../../constants";
import { usePagination } from "../../../hooks/usePagination";

async function fetchNextPages(cursor?: string | null | undefined) {
  const url = queryString.stringifyUrl({
    url: "/api/utils/paginate",
    query: {
      pageSize: PAGE_SIZE,
      cursor: cursor,
    },
  });

  const response = await fetch(url);
  const { data, cursor: newCursor } = await response.json();
  return {
    data,
    newCursor,
  };
}

interface Props {
  articles: Article[];
  totalCount: number;
  cursor: string;
}

export default function SSGISRExampleTemplate({
  articles,
  totalCount,
  cursor,
}: Props) {
  const {
    data: currentArticles,
    onPageChange,
    fetching,
    currentPage,
  } = usePagination({
    cursor,
    initialArticles: articles,
    pageSize: PAGE_SIZE,
  });

  return (
    <Layout>
      <NextSeo
        title="SSG and ISR Example"
        description="Example of using SSG and ISR"
      />
      <ArticleList
        headerText={"SSG and ISR Example"}
        articles={articles}
        totalCount={totalCount}
        cursor={cursor}
        fetcher={fetchNextPages}
        additionalHeader={
          <div className="prose lg:prose-xl my-10 flex flex-col">
            <p>
              <em>
                By default, this starter kit is optimized for SSR and Edge
                Caching on Pantheon. This example instead uses Incremental
                Static Regeneration and is provided as a reference for cases
                where Next.js static generation options would be beneficial.
              </em>
            </p>
          </div>
        }
      />
    </Layout>
  );
}

export async function getStaticProps() {
  try {
    const {
      data: articles,
      totalCount,
      cursor,
    } = await PCCConvenienceFunctions.getPaginatedArticles({
      pageSize: PAGE_SIZE,
    });

    return {
      props: {
        articles,
        cursor,
        totalCount,
      },
      revalidate: 60,
    };
  } catch (e) {
    console.error(e);

    return {
      notFound: true,
    };
  }
}
