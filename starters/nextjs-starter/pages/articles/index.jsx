import {
  PCCConvenienceFunctions,
  usePagination,
} from "@pantheon-systems/pcc-react-sdk";
import { NextSeo } from "next-seo";
import { PostGrid } from "../../components/grid";
import Layout from "../../components/layout";
import PageHeader from "../../components/page-header";
import Pagination from "../../components/pagination";

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
      <NextSeo
        title="Decoupled Next PCC Demo"
        description="Generated by create-pantheon-decoupled-kit."
      />
      <div className="max-w-screen-lg mx-auto">
        <section>
          <PageHeader title="Articles" />
          <PostGrid contentType="posts" data={currentArticles} />
          <div className="flex flex-row mt-4 justify-center items-center">
            <Pagination
              totalCount={totalCount}
              pageSize={PAGE_SIZE}
              currentPage={currentPage}
              onChange={onPageChange}
              disabled={fetching}
            />
          </div>
        </section>
      </div>
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
