import {
  Article,
  ArticleWithoutContent,
  PCCConvenienceFunctions,
} from "@pantheon-systems/pcc-react-sdk";
import { NextSeo } from "next-seo";
import { ArticleGrid } from "../../../components/grid";
import Layout from "../../../components/layout";
import PageHeader from "../../../components/page-header";
import Pagination from "../../../components/pagination";
import { usePagination } from "../../../hooks/usePagination";

const PAGE_SIZE = 20;

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
      <section className="max-w-screen-3xl mx-auto px-4 pt-16 sm:w-4/5 md:w-3/4 lg:w-4/5 2xl:w-3/4">
        <PageHeader title="SSG and ISR Example" />
        <div className="prose lg:prose-xl my-10 flex flex-col">
          <p>
            <em>
              By default, this starter kit is optimized for SSR and Edge Caching
              on Pantheon. This example instead uses Incremental Static
              Regeneration and is provided as a reference for cases where
              Next.js static generation options would be beneficial.
            </em>
          </p>
        </div>

        <ArticleGrid
          articles={currentArticles as ArticleWithoutContent[]}
          basePath={"/examples/ssg-isr"}
        />
        <div className="mt-4 flex flex-row items-center justify-center">
          <Pagination
            totalCount={totalCount}
            pageSize={PAGE_SIZE}
            currentPage={currentPage}
            onChange={onPageChange}
            disabled={fetching}
          />
        </div>
      </section>
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
