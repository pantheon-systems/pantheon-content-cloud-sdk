import { PCCConvenienceFunctions } from "@pantheon-systems/pcc-react-sdk/server";
import { Metadata } from "next";
import ArticleList from "../../../components/article-list";
import Layout from "../../../components/layout";
import { PAGE_SIZE } from "../../../constants";

export const metadata: Metadata = {
  title: "SSG and ISR Example",
  description: "Example of using SSG and ISR",
};

async function fetchNextPages(cursor: string) {
  "use server";
  const { data, cursor: newCursor } =
    await PCCConvenienceFunctions.getPaginatedArticles({
      pageSize: PAGE_SIZE,
      cursor,
    });
  return {
    data,
    newCursor,
  };
}

export default async function SSGISRExampleTemplate() {
  const {
    data: articles,
    cursor,
    totalCount,
  } = await PCCConvenienceFunctions.getPaginatedArticles({
    pageSize: PAGE_SIZE,
  });

  return (
    <Layout>
      <ArticleList
        headerText={"SSG and ISR Example"}
        articles={articles}
        totalCount={totalCount}
        cursor={cursor}
        fetcher={fetchNextPages}
        additionalHeader={
          <div className="prose lg:prose-xl mx-auto mb-8 mt-8 max-w-lg lg:max-w-screen-lg">
            <p>
              <em>
                By default, this starter kit is optimized for SSR and Edge
                Caching on Pantheon. This example instead uses Incremental
                Static Regeneration and is provided as a reference for cases
                where Next.js static generation options would be beneficial.
              </em>
            </p>
          </div>
        }
      />
    </Layout>
  );
}

export async function generateStaticParams() {
  // This function is empty because we're not generating any dynamic routes
  // It's included to demonstrate where you would put the logic for generating
  // static params if needed in the future
  return [];
}
