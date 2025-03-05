import { Article } from "@pantheon-systems/pcc-react-sdk/*";
import Link from "next/link";
import useSWR from "swr";
import { cn } from "../../lib/utils";

// Interface to match the structure defined in smart component map
interface DocumentIdItem {
  item: string;
}

interface Props {
  documentIds:
    | DocumentIdItem[]
    | DocumentIdItem
    | Record<string, DocumentIdItem | string>
    | string[]
    | string;
}

interface ArticleTileData {
  id: string;
  image: string | null;
  title: string;
  url: string;
}

type NavigationTileProps = {
  article: ArticleTileData;
  isWide?: boolean;
};

// Component to display a single article tile
function NavigationTile({ article, isWide = true }: NavigationTileProps) {
  return (
    <div
      className={cn(
        "group flex h-full flex-col overflow-clip rounded-xl shadow-lg ring-1 ring-gray-300/50",
        isWide ? "sm:flex-row" : "",
      )}
    >
      <div
        className={cn(
          "aspect-video w-full flex-shrink-0 overflow-hidden",
          isWide ? "sm:h-full sm:w-[200px] sm:max-w-[200px]" : "",
        )}
      >
        <TileCoverImage
          imageSrc={article.image}
          imageAltText={`Cover image for ${article.title}`}
        />
      </div>
      <div
        className={cn(
          "flex flex-grow flex-col justify-between p-6",
          isWide && "sm:p-6",
        )}
      >
        <div>
          <h1 className="mb-3 text-xl font-semibold leading-7">
            {article.title}
          </h1>
        </div>
        <Link
          href={article.url}
          className="mt-4 font-medium text-black hover:text-gray-600"
        >
          Read more →
        </Link>
      </div>
    </div>
  );
}

// Simple component for placeholder images
function TileCoverImage({
  imageSrc,
  imageAltText,
}: {
  imageSrc: string | null | undefined;
  imageAltText?: string | undefined;
}) {
  return imageSrc != null ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={imageSrc}
      alt={imageAltText}
      className="h-full w-full object-cover"
    />
  ) : (
    <div className="h-full w-full bg-gradient-to-t from-neutral-800 to-neutral-100" />
  );
}

function getDocIDsFromProps(documentIds: Props["documentIds"]): string[] {
  // Safely extract document links or IDs, handling different possible formats
  let docLinksOrIDs: string[] = [];

  if (Array.isArray(documentIds)) {
    // If documentIds is already an array
    docLinksOrIDs = documentIds
      .map((doc) => {
        if (typeof doc === "string") return doc;
        if (doc && typeof doc === "object" && "item" in doc)
          return String(doc.item);
        return "";
      })
      .filter(Boolean);
  } else if (documentIds && typeof documentIds === "object") {
    // If documentIds is an object (but not array)
    if ("item" in documentIds) {
      // If it's a single item object
      docLinksOrIDs = [String(documentIds.item)];
    } else {
      // Try to convert object to array if possible
      try {
        const values = Object.values(documentIds);
        docLinksOrIDs = values
          .map((val) => {
            if (typeof val === "string") return val;
            if (val && typeof val === "object" && "item" in val)
              return String(val.item);
            return "";
          })
          .filter(Boolean);
      } catch (e) {
        console.error("Error parsing documentIds:", e);
      }
    }
  } else if (typeof documentIds === "string") {
    // If it's a single string
    docLinksOrIDs = [documentIds];
  }

  // The docLinks contains the GDoc links of the docs.
  // So if it has the strucutre of https://docs.google.com/document/d/<docId>/*
  // We need to extract the <docId> and use that to fetch the article data.
  const docIds = docLinksOrIDs
    .map((linkOrDocID) => {
      const match = linkOrDocID.match(
        /https:\/\/docs\.google\.com\/document\/d\/(.*)\//,
      );
      // If there is a match, return the <docId>
      // Otherwise, return the linkOrDocID, with the assumption that it is already the <docId>
      return match ? match[1] : linkOrDocID;
    })
    .filter(Boolean);

  return docIds;
}

// Fetcher function for SWR
const fetcher = async (url: string, ids: string[]) => {
  // Add the document IDs to the URL as query parameters
  const queryParams = new URLSearchParams();
  queryParams.append("documentIds", ids.join(","));
  const urlWithParams = `${url}?${queryParams.toString()}`;

  const response = await fetch(urlWithParams, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch article data");
  }

  return response.json();
};

const TileNavigation = ({ documentIds }: Props) => {
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
    return null;
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
      <div className="w-full">
        <NavigationTile article={data?.data[0]} isWide={true} />
      </div>
    );
  }

  return (
    <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-2">
      {data?.data?.map((article: ArticleTileData, index: number) => (
        <div key={`article-${article.id}-${index}`}>
          <NavigationTile article={article} isWide={false} />
        </div>
      ))}
    </div>
  );
};

export default TileNavigation;
