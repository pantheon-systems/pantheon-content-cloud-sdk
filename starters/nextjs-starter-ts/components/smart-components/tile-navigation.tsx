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
  slug: string | null;
  description: string | null;
}

type NavigationTileProps = {
  article: ArticleTileData;
  isWide?: boolean;
};

// Component to display a single article tile
function NavigationTile({ article, isWide = true }: NavigationTileProps) {
  // Use the article id to construct a simple URL
  const targetHref = `/articles/${article.slug ? article.slug : article.id}`;

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
          isWide
            ? "sm:h-full sm:w-[200px] sm:max-w-[200px]"
            : "",
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
          {article.description ? (
            <p className="line-clamp-3 text-gray-600">
              {article.description}
            </p>
          ) : null}
        </div>
        <Link
          href={targetHref}
          className="mt-4 font-medium text-blue-600 hover:text-blue-800"
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

function getDocIDsFromPros(documentIds: Props["documentIds"]): string[] {
  // Safely extract document IDs, handling different possible formats
  let docIds: string[] = [];

  if (Array.isArray(documentIds)) {
    // If documentIds is already an array
    docIds = documentIds
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
      docIds = [String(documentIds.item)];
    } else {
      // Try to convert object to array if possible
      try {
        const values = Object.values(documentIds);
        docIds = values
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
    docIds = [documentIds];
  }

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
  console.log("documentIds", documentIds);
  // Safely extract document IDs, handling different possible formats
  const docIds = getDocIDsFromPros(documentIds);

  // Validate documentIds (min 1, max 5)
  const validDocIds = docIds.slice(0, 5);

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

  if (validDocIds.length < 1) {
    return (
      <div className="p-4">
        Error: TileNavigation requires at least 1 document ID
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {validDocIds.map((id) => (
          <div key={id} className="rounded-xl border p-4 shadow-md">
            Loading article...
          </div>
        ))}
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

  // Add copies of the first article to the end of the array if needed
  const extendedData = [
    ...data?.data,
    ...data?.data,
    // ...data?.data,
    // ...data?.data,
  ];

  // If there's only one article, make it take up the full width with horizontal layout
  if (extendedData?.length === 1) {
    return (
      <div className="w-full">
        <NavigationTile article={extendedData[0]} isWide={true} />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
      {extendedData?.map((article: ArticleTileData) => (
        <div key={article.id}>
          <NavigationTile article={article} isWide={false} />
        </div>
      ))}
    </div>
  );
};

export default TileNavigation;
