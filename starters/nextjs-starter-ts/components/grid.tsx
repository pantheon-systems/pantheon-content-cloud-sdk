import type { ArticleWithoutContent } from "@pantheon-systems/pcc-react-sdk";
import Link from "next/link";
import { cn } from "../lib/utils";
import { Button } from "./ui/button";

export function HomepageArticleGrid({
  articles,
}: {
  articles: ArticleWithoutContent[];
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:w-2/3 2xl:w-full 2xl:grid-cols-[repeat(auto-fit,minmax(300px,438px))] 2xl:justify-center",
      )}
    >
      {articles.map((article, index) => (
        <ArticleGridCard
          key={article.id}
          article={article}
          isWide={articles.length === 1 || (articles.length > 2 && index === 2)}
        />
      ))}
    </div>
  );
}

export function ArticleGrid({
  articles,
  basePath = "/articles",
}: {
  articles: ArticleWithoutContent[];
  basePath?: string;
}) {
  return (
    <div className={cn("grid grid-cols-1 gap-8 lg:grid-cols-2 xl:grid-cols-3")}>
      {articles.map((article) => (
        <ArticleGridCard
          key={article.id}
          article={article}
          basePath={basePath}
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
  const imageSrc = (article.metadata?.["image"] as string) || null;

  return (
    <div
      className={cn(
        "group flex h-full flex-col overflow-clip rounded-xl shadow-lg ring-1 ring-gray-300/50",
        isWide
          ? "sm:col-span-2 sm:flex-row 2xl:col-span-1 2xl:flex-col 2xl:only:col-span-2 2xl:only:flex-row"
          : "",
      )}
    >
      <div
        className={cn(
          "aspect-video w-full flex-shrink-0 overflow-hidden sm:h-[196px]",
          isWide
            ? "sm:h-full sm:max-w-[49%] 2xl:h-[196px] 2xl:max-w-[100%] 2xl:group-only:h-full 2xl:group-only:max-w-[49%]"
            : "max-w-[100%]",
        )}
      >
        <GridItemCoverImage
          imageSrc={imageSrc}
          imageAltText={imageAltText || `Cover image for ${article.title}`}
        />
      </div>
      <div
        className={cn(
          "flex flex-grow flex-col justify-between p-8",
          isWide && "sm:py-24 2xl:py-8 2xl:group-only:py-24",
        )}
      >
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
        <Link href={targetHref} className="mt-8">
          <Button size="large">View</Button>
        </Link>
      </div>
    </div>
  );
}

function GridItemCoverImage({
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
