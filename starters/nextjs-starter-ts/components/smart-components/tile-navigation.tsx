import { PCCConvenienceFunctions } from "@pantheon-systems/pcc-react-sdk";
import type { Article, ArticleWithoutContent } from "@pantheon-systems/pcc-react-sdk";
import Link from "next/link";
import { useState, useEffect } from "react";

// Interface to match the structure defined in smart component map
interface DocumentIdItem {
  item: string;
}

interface Props {
  documentIds: DocumentIdItem[] | DocumentIdItem | Record<string, DocumentIdItem | string> | string[] | string;
}

const TileNavigation = ({ documentIds }: Props) => {
  const [articles, setArticles] = useState<ArticleWithoutContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        console.log("Client component - documentIds:", documentIds);
        
        // Safely extract document IDs, handling different possible formats
        let docIds: string[] = [];
        
        if (Array.isArray(documentIds)) {
          // If documentIds is already an array
          docIds = documentIds.map(doc => {
            if (typeof doc === 'string') return doc;
            if (doc && typeof doc === 'object' && 'item' in doc) return String(doc.item);
            return '';
          }).filter(Boolean);
        } else if (documentIds && typeof documentIds === 'object') {
          // If documentIds is an object (but not array)
          if ('item' in documentIds) {
            // If it's a single item object
            docIds = [String(documentIds.item)];
          } else {
            // Try to convert object to array if possible
            try {
              const values = Object.values(documentIds);
              docIds = values.map(val => {
                if (typeof val === 'string') return val;
                if (val && typeof val === 'object' && 'item' in val) return String(val.item);
                return '';
              }).filter(Boolean);
            } catch (e) {
              console.error("Error parsing documentIds:", e);
            }
          }
        } else if (typeof documentIds === 'string') {
          // If it's a single string
          docIds = [documentIds];
        }
        
        console.log("Client component - Processed docIds:", docIds);
        
        // Validate documentIds (min 2, max 5)
        const validDocIds = docIds.slice(0, 5);
        if (validDocIds.length < 1) {
          setError("Error: TileNavigation requires at least 1 document ID");
          setIsLoading(false);
          return;
        }

        // Fetch articles using Document IDs in parallel
        const articlePromises = validDocIds.map(async (docId) => {
          try {
            console.log("Client component - fetching article with ID:", docId);
            return await PCCConvenienceFunctions.getArticleBySlugOrId(docId);
          } catch (error) {
            console.error(`Client component - Error fetching article with ID ${docId}:`, error);
            return null;
          }
        });

        const fetchedArticles = await Promise.all(articlePromises);

        // Filter out any null articles (failed fetches)
        const validArticles = fetchedArticles.filter(Boolean) as ArticleWithoutContent[];
        console.log("Client component - fetched articles count:", validArticles.length);

        if (!validArticles || validArticles.length === 0) {
          setError("No articles found for the provided document IDs.");
        } else {
          setArticles(validArticles);
        }
      } catch (err) {
        console.error("Client component - Error fetching articles:", err);
        setError("Error loading articles.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, [documentIds]);

  if (isLoading) {
    return <div className="p-4">Loading articles...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-600">{error}</div>;
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
      {articles.map((article) => (
        <NavigationTile 
          key={article.id} 
          article={article}
        />
      ))}
    </div>
  );
};

interface NavigationTileProps {
  article: ArticleWithoutContent;
}

function NavigationTile({ article }: NavigationTileProps) {
  // Use the article slug to construct a simple URL
  const targetHref = `/articles/${article.slug ? article.slug : article.id}`;
  const imageSrc = (article.metadata?.["image"] as string) || null;

  return (
    <div className="group flex h-full flex-col overflow-clip rounded-xl shadow-lg ring-1 ring-gray-300/50">
      <div className="aspect-video w-full flex-shrink-0 overflow-hidden sm:h-[196px]">
        <TileCoverImage
          imageSrc={imageSrc}
          imageAltText={`Cover image for ${article.title}`}
        />
      </div>
      <div className="flex flex-grow flex-col justify-between p-8">
        <div>
          <h1 className="mb-3 text-xl font-semibold leading-7">
            {article.title}
          </h1>
          {article.metadata?.["Description"] ? (
            <p className="line-clamp-3 min-h-[4.5rem] text-gray-600">
              {article.metadata?.["Description"]?.toString() || ""}
            </p>
          ) : null}
        </div>
        <Link href={targetHref} className="mt-8 text-blue-600 hover:text-blue-800 font-medium">
          Read more →
        </Link>
      </div>
    </div>
  );
}

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

export default TileNavigation;