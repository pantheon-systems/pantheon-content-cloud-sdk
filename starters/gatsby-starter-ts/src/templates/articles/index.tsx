import React from "react";

import PageHeader from "../../components/page-header";
import { PageGrid } from "../../components/grid";
import Layout from "../../components/layout";

export default function ArticlesListTemplate({ pageContext: { articles } }) {
  const RenderCurrentItems = ({ currentItems }) => {
    return <PageGrid data={currentItems} />;
  };

  return (
    <Layout>
      <div className="max-w-screen-lg mx-auto">
        <section>
          <PageHeader title="Articles" />
          <RenderCurrentItems currentItems={articles} />
        </section>
      </div>
    </Layout>
  );
}
