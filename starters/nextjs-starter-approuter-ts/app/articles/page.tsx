import { PCCConvenienceFunctions } from "@pantheon-systems/pcc-react-sdk/server";
import Layout from "../../components/layout";
import PageHeader from "../../components/page-header";
import { Client } from "./client";

export default async function ArticlesListTemplate() {
  const articles = await PCCConvenienceFunctions.getAllArticles();

  return (
    <Layout>
      <div className="max-w-screen-lg mx-auto">
        <section>
          <PageHeader title="Articles" />
          <Client articles={articles} />
        </section>
      </div>
    </Layout>
  );
}

export function generateMetadata() {
  return {
    title: "Decoupled Next PCC Demo",
    description: "Generated by create-pantheon-decoupled-kit.",
  };
}
