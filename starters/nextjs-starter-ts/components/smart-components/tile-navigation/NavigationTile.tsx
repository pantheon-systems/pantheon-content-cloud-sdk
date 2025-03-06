import Link from "next/link";
import { cn } from "../../../lib/utils";
import TileCoverImage from "./TileCoverImage";
import { ArticleTileData } from "./fetcher";


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

export default NavigationTile;
