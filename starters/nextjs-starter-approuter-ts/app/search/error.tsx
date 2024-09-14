"use client";

import Layout from "../../components/layout";
import SearchResults from "./search-results";

export default function SearchError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  console.error(error);

  return (
    <Layout>
      <SearchResults searchResults={null} error />
    </Layout>
  );
}

export function generateMetadata() {
  return {
    title: "Search results",
    description: "Error loading search results",
  };
}
