import { PCCConvenienceFunctions } from "@pantheon-systems/pcc-react-sdk/server";
import { Metadata } from "next";
import { ArticleGrid } from "../../../components/grid";
import Layout from "../../../components/layout";
import PageHeader from "../../../components/page-header";

export const metadata: Metadata = {
  title: "SSG and ISR Example",
  description: "Example of using SSG and ISR",
};

export default async function SSGISRExampleTemplate() {
  const articles = await PCCConvenienceFunctions.getAllArticles();

  return (
    <Layout>
      <section className="max-w-screen-3xl mx-auto px-4 pt-16 sm:w-4/5 md:w-3/4 lg:w-4/5 2xl:w-3/4">
        <PageHeader title="SSG and ISR Example" />
        <div className="prose lg:prose-xl mx-auto mb-8 mt-8 max-w-lg lg:max-w-screen-lg">
          <p>
            <em>
              By default, this starter kit is optimized for SSR and Edge Caching
              on Pantheon. This example instead uses Incremental Static
              Regeneration and is provided as a reference for cases where
              Next.js static generation options would be beneficial.
            </em>
          </p>
        </div>

        <ArticleGrid articles={articles} basePath="/examples/ssg-isr" />
      </section>
    </Layout>
  );
}

export async function generateStaticParams() {
  // This function is empty because we're not generating any dynamic routes
  // It's included to demonstrate where you would put the logic for generating
  // static params if needed in the future
  return [];
}
