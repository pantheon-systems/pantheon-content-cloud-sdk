import {
  PCCConvenienceFunctions,
  usePagination,
} from "@pantheon-systems/pcc-react-sdk";
import { NextSeo } from "next-seo";
import Image from "next/image";
import { PostGrid } from "../components/grid";
import Layout from "../components/layout";
import Pagination from "../components/pagination";

const PAGE_SIZE = 20;
export default function Home({ articles, totalCount, cursor }) {
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
  const HomepageHeader = () => (
    <div className="flex flex-col mx-auto mt-20 prose sm:prose-xl max-w-fit">
      <h1 className="h-full text-4xl prose text-center">
        Welcome to{" "}
        <a
          className="text-blue-600 no-underline hover:underline"
          href="https://nextjs.org"
        >
          Next.js!
        </a>
      </h1>
      <div className="text-2xl">
        <div className="flex items-center justify-center p-4 text-white bg-black rounded">
          Decoupled PCC on{" "}
          <Image
            src="/pantheon.png"
            alt="Pantheon Logo"
            style={{
              margin: 0,
            }}
            width={191}
            height={60}
          />
        </div>
      </div>
    </div>
  );

  return (
    <Layout>
      <NextSeo
        title="Decoupled Next PCC Demo"
        description="Generated by create-pantheon-decoupled-kit."
      />
      <HomepageHeader />
      <section>
        <PostGrid contentType="posts" data={currentArticles} />
        <div className="flex mt-4 flex-row justify-center items-center">
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
      cursor,
      totalCount,
    },
  };
}
