import useSWR from "swr";
import { fetcher, ArticleTileData } from "./fetcher";
import { getDocIDsFromProps } from "./documentUtils";
import NavigationTile from "./NavigationTile";

/**
 * TileNavigation Component
 * 
 * This smart component displays a responsive grid of article tiles with cover images.
 * It fetches article data based on the provided document IDs and renders them as interactive tiles.
 * 
 * @component
 * 
 * Input format options:
 * - Array of strings: Each string is a document ID or Google Doc URL
 * - Single string: A single document ID or Google Doc URL
 * - Object with 'item' property: Complex object containing document IDs (from CMS field)
 * - Record object: Key-value pairs where values contain document IDs
 * 
 * Note: For security reasons, the component has a hard limit of MAX_TILES tiles.
 */

// Interface to match the structure defined in smart component map
interface DocumentIdItem {
  item: string;
}

export interface Props {
  documentIds:
    | DocumentIdItem[]
    | DocumentIdItem
    | Record<string, DocumentIdItem | string>
    | string[]
    | string;
}

// Maximum number of tiles to prevent abuse
const MAX_TILES = 10;

const TileNavigation = ({ documentIds }: Props) => {
  // Safely extract document IDs, handling different possible formats
  const docIds = getDocIDsFromProps(documentIds);

  // Validate documentIds (min 1, max MAX_TILES)
  const validDocIds = docIds.slice(0, MAX_TILES);

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

  // If there's an error or no data, fail silently to prevent breaking the article
  if (error || !data?.data || data.data.length === 0) {
    return <div />;
  }

  // If there's only one article, make it take up the full width with horizontal layout
  if (data.data.length === 1) {
    return (
      <div className="w-4/5 mx-auto">
        <NavigationTile article={data.data[0]} isWide={true} />
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <div className="grid w-4/5 grid-cols-1 gap-8 mx-auto md:grid-cols-2">
        {data.data.map((article: ArticleTileData, index: number) => (
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
