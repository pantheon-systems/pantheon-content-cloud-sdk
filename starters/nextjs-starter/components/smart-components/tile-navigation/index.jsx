import useSWR from "swr";
import { fetcher } from "./fetcher";
import { getDocIDsFromProps } from "./documentUtils";
import NavigationTile from "./NavigationTile";

const TileNavigation = ({ documentIds }) => {
  // Safely extract document IDs, handling different possible formats
  const docIds = getDocIDsFromProps(documentIds);

  // Validate documentIds (min 1, max 10)
  const validDocIds = docIds.slice(0, 10);

  // Use SWR to fetch article data - moved before conditional returns
  const { data, error, isLoading } = useSWR(
    validDocIds.length > 0
      ? ["/api/articles/tilenavigation", validDocIds]
      : null,
    ([url, ids]) => fetcher(url, ids),
    {
      revalidateOnFocus: false, // Disable revalidation on window focus
      dedupingInterval: 60000, // Deduplicate requests within 1 minute
    },
  );

  // If there are no document IDs, return nothing
  if (validDocIds.length < 1) {
    return <div />;
  }

  if (isLoading) {
    return (
      <div className="flex h-40 w-full items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        Error loading articles: {error.message || "Unknown error"}
      </div>
    );
  }

  // If there's only one article, make it take up the full width with horizontal layout
  if (data?.data?.length === 1) {
    return (
      <div className="w-4/5 mx-auto">
        <NavigationTile article={data?.data[0]} isWide={true} />
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <div className="grid w-4/5 grid-cols-1 gap-8 mx-auto md:grid-cols-2">
        {data?.data?.map((article, index) => (
            <NavigationTile
              key={`article-${article.id}-${index}`}
              article={article}
              isWide={false}
            />
        ))}
      </div>
    </div>
  );
};

export default TileNavigation;