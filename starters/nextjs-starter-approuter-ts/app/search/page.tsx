import { PCCConvenienceFunctions } from "@pantheon-systems/pcc-react-sdk/server";
import Layout from "../../components/layout";
import SearchResults from "./search-results";

interface Props {
  searchParams: { q?: string | null | undefined };
}

export default async function SearchPage({ searchParams }: Props) {
  const searchResults = await PCCConvenienceFunctions.getAllArticlesWithSummary(
    {
      publishingLevel: "PRODUCTION",
    },
    searchParams.q
      ? {
          bodyContains: searchParams.q,
        }
      : undefined,
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

export function generateMetadata({ searchParams }: Props) {
  return {
    title: `Search results for "${searchParams.q}"`,
    description: `Search results for "${searchParams.q}"`,
  };
}
