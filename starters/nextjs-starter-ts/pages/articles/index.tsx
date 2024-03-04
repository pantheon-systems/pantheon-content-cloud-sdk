import { Paginator } from "@pantheon-systems/nextjs-kit";
import { PCCConvenienceFunctions } from "@pantheon-systems/pcc-react-sdk";
import { NextSeo } from "next-seo";
import { PageGrid } from "../../components/grid";
import Layout from "../../components/layout";
import PageHeader from "../../components/page-header";

export default function ArticlesListTemplate({ articles }) {
  const RenderCurrentItems = ({ currentItems }) => {
    return <PageGrid contentType="pages" data={currentItems} />;
  };

  return (
    <Layout>
      <NextSeo
        title="Decoupled Next PCC Demo"
        description="Generated by create-pantheon-decoupled-kit."
      />
      <div className="max-w-screen-lg mx-auto">
        <section>
          <PageHeader title="Articles" />
          <Paginator
            data={articles}
            itemsPerPage={12}
            Component={RenderCurrentItems}
          />
        </section>
      </div>
    </Layout>
  );
}

export async function getServerSideProps() {
  const articles = await PCCConvenienceFunctions.getAllArticles();

  return {
    props: {
      articles,
    },
  };
}
