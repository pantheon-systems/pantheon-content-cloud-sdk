import { PCCConvenienceFunctions } from "@pantheon-systems/pcc-react-sdk";
import { NextSeo } from "next-seo";
import Image from "next/image";
import {
  FaFacebookSquare,
  FaInstagramSquare,
  FaLinkedin,
} from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { PiMediumLogoFill } from "react-icons/pi";
import { ArticleGrid } from "../../components/grid";
import Layout from "../../components/layout";
import Pagination from "../../components/pagination";
import { usePagination } from "../../hooks/usePagination";

const PAGE_SIZE = 20;

export default function ArticlesListTemplate({
  articles,
  totalCount,
  cursor,
  author,
}) {
  const {
    data: currentArticles,
    onPageChange,
    fetching,
    currentPage,
  } = usePagination({
    cursor,
    initialArticles: articles,
    pageSize: PAGE_SIZE,
    author,
  });

  return (
    <Layout>
      <NextSeo title="Articles" description="Articles" />

      <section className="max-w-screen-3xl mx-auto px-4 pt-16 sm:w-4/5 md:w-3/4 lg:w-4/5 2xl:w-3/4">
        <div className="border-base-300 mb-14 border-b-[1px] pb-7">
          <div className="flex flex-row gap-x-6">
            <div>
              <Image
                className="m-0 rounded-full"
                src="/images/no-avatar.png"
                width={90}
                height={90}
                alt={`Avatar of ${author}`}
              />
            </div>
            <div className="flex flex-col justify-between">
              <h1 className="text-5xl font-bold capitalize">{author}</h1>
              <div>A short line about the author</div>
            </div>
          </div>
          <div className="my-8 flex flex-row gap-x-3">
            <FaLinkedin className="h-7 w-7" fill="#404040" />
            <FaSquareXTwitter className="h-7 w-7" fill="#404040" />
            <PiMediumLogoFill className="h-7 w-7" fill="#404040" />
            <FaFacebookSquare className="h-7 w-7" fill="#404040" />
            <FaInstagramSquare className="h-7 w-7" fill="#404040" />
            <MdEmail className="h-7 w-7" fill="#404040" />
          </div>
          <div>
            {author} is a passionate content writer with a flair for turning
            ideas into engaging stories. When she’s not writing, Jane enjoys
            cozy afternoons with a good book, exploring new coffee spots, and
            finding inspiration in everyday moments.
          </div>
        </div>
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

export async function getServerSideProps({ query: { author } }) {
  const {
    data: articles,
    totalCount,
    cursor,
  } = await PCCConvenienceFunctions.getPaginatedArticles({
    pageSize: PAGE_SIZE,
    metadataFilters: {
      author,
    },
  });

  return {
    props: {
      articles,
      cursor,
      totalCount,
      author,
    },
  };
}
