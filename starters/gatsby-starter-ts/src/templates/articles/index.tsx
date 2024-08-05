import { navigate } from "gatsby";
import React from "react";
import { PageGrid } from "../../components/grid";
import Layout from "../../components/layout";
import PageHeader from "../../components/page-header";
import Pagination from "../../components/pagination";

export default function ArticlesListTemplate({
  pageContext: { articles, totalCount, currentPage, pageSize },
}) {
  const RenderCurrentItems = ({ currentItems }) => {
    return <PageGrid data={currentItems} />;
  };

  const onPageChange = (page: number) => {
    if (page === 0) navigate("/articles");
    else navigate(`/articles/${page + 1}`);
  };
  return (
    <Layout>
      <div className="max-w-screen-lg mx-auto">
        <section>
          <PageHeader title="Articles" />
          <RenderCurrentItems currentItems={articles} />
          <div className="mt-4 flex flex-row justify-center items-center">
            <Pagination
              totalCount={totalCount}
              pageSize={pageSize}
              currentPage={currentPage}
              onChange={onPageChange}
            />
          </div>
        </section>
      </div>
    </Layout>
  );
}
