import React from "react";
import Layout from "../../components/layout";
import SearchResults from "./search-results";
import "react-loading-skeleton/dist/skeleton.css";

export default function SearchLoading() {
  return (
    <Layout>
      <SearchResults isLoading={true} searchResults={null} />
    </Layout>
  );
}

export function generateMetadata() {
  return {
    title: "Search results",
    description: "Loading search results",
  };
}
