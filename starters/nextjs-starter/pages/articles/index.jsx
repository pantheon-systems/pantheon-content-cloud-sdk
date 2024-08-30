import { PCCConvenienceFunctions } from "@pantheon-systems/pcc-react-sdk";
import { NextSeo } from "next-seo";
import { ArticleGrid } from "../../components/grid";
import Layout from "../../components/layout";
import PageHeader from "../../components/page-header";
import Pagination from "../../components/pagination";
import { usePagination } from "../../hooks/usePagination";

const PAGE_SIZE = 20;

export default function ArticlesListTemplate({ articles, totalCount, cursor }) {
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
      <NextSeo title="Articles" description="Articles" />

      <section className="max-w-screen-3xl mx-auto px-4 pt-16 sm:w-4/5 md:w-3/4 lg:w-4/5 2xl:w-3/4">
        <PageHeader title="Articles" />

        <ArticleGrid articles={currentArticles} />

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

export async function getServerSideProps() {
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
      totalCount,
      cursor,
    },
  };
}
