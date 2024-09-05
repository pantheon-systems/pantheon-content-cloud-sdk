import { PCCConvenienceFunctions } from "@pantheon-systems/pcc-react-sdk/server";
import Layout from "../../components/layout";
import SearchResults from "./search-results";

export default async function SearchPage({ searchParams }) {
  const searchResults = await PCCConvenienceFunctions.getAllArticlesWithSummary(
    {
      publishingLevel: "PRODUCTION",
    },
    {
      bodyContains: searchParams.q,
    },
    true,
  );

  return (
    <Layout>
      <SearchResults
        searchResults={searchResults.articles}
        summary={searchResults.summary}
      />
    </Layout>
  );
}

export function generateMetadata({ searchParams }) {
  return {
    title: `Search results for "${searchParams.q}"`,
    description: `Search results for "${searchParams.q}"`,
  };
}
