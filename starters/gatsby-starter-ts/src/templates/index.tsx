import { navigate } from "gatsby";
import React from "react";
import { PostGrid } from "../components/grid";
import Layout from "../components/layout";
import Pagination from "../components/pagination";
import Seo from "../components/seo";
//@ts-ignore
import PantheonLogo from "../images/pantheon.png";

export default function Home({ ...props }) {
  const { articles, totalCount, currentPage, pageSize } = props.pageContext;

  const onPageChange = (page: number) => {
    if (page === 0) navigate("/");
    else navigate(`/${page + 1}`);
  };

  const HomepageHeader = () => (
    <div className="flex flex-col mx-auto mt-20 prose sm:prose-xl max-w-fit">
      <h1 className="h-full text-4xl prose text-center">
        Welcome to{" "}
        <a
          className="text-blue-600 no-underline hover:underline"
          href="https://gatsbyjs.com"
        >
          Gatsby
        </a>
      </h1>
      <div className="mt-8 text-2xl">
        <div className="flex items-center justify-center p-4 text-white bg-black rounded">
          Decoupled PCC on{" "}
          <img
            src={PantheonLogo}
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
      <Seo
        title={"Decoupled Gatsby PCC Demo"}
        description={"Generated by create-pantheon-decoupled-kit."}
      />
      <HomepageHeader />
      <section>
        <PostGrid data={articles} />
        <div className="mt-4 flex flex-row justify-center items-center">
          <Pagination
            totalCount={totalCount}
            pageSize={pageSize}
            currentPage={currentPage}
            onChange={onPageChange}
          />
        </div>
      </section>
    </Layout>
  );
}
