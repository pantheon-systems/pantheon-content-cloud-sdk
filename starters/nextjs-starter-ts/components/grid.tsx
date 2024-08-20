import type { ArticleWithoutContent } from "@pantheon-systems/pcc-react-sdk";
import Link from "next/link";
import { cn } from "../lib/utils";
import { Button } from "./ui/button";

interface ArticleGridProps {
  articles: ArticleWithoutContent[];
  showWide?: boolean;
}

export default function ArticleGrid({ articles, showWide }: ArticleGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 px-4 mx-auto sm:grid-cols-2 2xl:grid-cols-3 sm:px-6 lg:px-0 lg:w-2/3 2xl:w-3/4">
      {articles.map((article, index) => (
        <ArticleGridCard
          key={article.id}
          article={article}
          isWide={
            showWide &&
            (articles.length === 1 || (articles.length > 2 && index === 2))
          }
        />
      ))}
    </div>
  );
}

interface ArticleGridCardProps {
  article: ArticleWithoutContent;
  basePath?: string;
  imageAltText?: string;
  isWide?: boolean;
}

export function ArticleGridCard({
  article,
  basePath = "/articles",
  imageAltText,
  isWide = false,
}: ArticleGridCardProps) {
  const targetHref = `${basePath}/${article.slug || article.id}`;
  const imageSrc = article.metadata?.["Hero Image"] || null;

  return (
    <div
      className={cn(
        "flex flex-col h-full shadow-lg overflow-clip ring-1 ring-gray-300/50 rounded-xl",
        isWide
          ? "sm:flex-row 2xl:flex-col sm:col-span-2 2xl:col-span-1 only:2xl:col-span-3 only:2xl:flex-row only:2xl:w-[900px] only:2xl:mx-auto"
          : "",
      )}
    >
      <div
        className={cn(
          "w-full aspect-video min-h-[196px] flex-shrink-0",
          isWide ? "sm:max-w-[49%] only:2xl:max-w-[100%]" : "max-w-[100%]",
        )}
      >
        <GridItemCoverImage
          imageSrc={imageSrc}
          imageAltText={imageAltText || `Cover image for ${article.title}`}
        />
      </div>
      <div
        className={cn(
          "p-8 flex flex-col flex-grow justify-between",
          isWide && "sm:py-24  only:2xl:py-24",
        )}
      >
        <div>
          <h1 className="mb-3 text-xl font-semibold leading-7">
            {article.title}
          </h1>
          {article.metadata?.["Description"] && (
            <p className="text-gray-600 line-clamp-3 min-h-[4.5rem]">
              {article.metadata?.["Description"]?.toString() || ""}
            </p>
          )}
        </div>
        <Link href={targetHref} className="mt-8">
          <Button size="large">View</Button>
        </Link>
      </div>
    </div>
  );
}

function GridItemCoverImage({ imageSrc, imageAltText }) {
  return imageSrc != null ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={imageSrc}
      alt={imageAltText}
      className="object-cover w-full h-full"
    />
  ) : (
    <div className="w-full h-full bg-gradient-to-t from-neutral-800 to-neutral-100" />
  );
}
