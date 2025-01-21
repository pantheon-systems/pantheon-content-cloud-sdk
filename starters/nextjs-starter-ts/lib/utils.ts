import { ArticleWithoutContent, Site } from "@pantheon-systems/pcc-react-sdk";
import { Article } from "@pantheon-systems/pcc-react-sdk/dist/types";
import { clsx, type ClassValue } from "clsx";
import { OpenGraph } from "next-seo/lib/types";
import { twMerge } from "tailwind-merge";
import { getAuthorById } from "./pcc-metadata-groups";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(input: string | number): string {
  const date = new Date(input);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

interface DateInputObject {
  msSinceEpoch: string;
}

function isDateInputObject(v: DateInputObject | unknown): v is DateInputObject {
  return (v as DateInputObject).msSinceEpoch != null;
}

export function getSeoMetadata(article: ArticleWithoutContent) {
  const tags: string[] =
    article.tags && article.tags.length > 0 ? article.tags : [];
  const imageProperties = [
    article.metadata?.image,
    article.metadata?.["image"],
    // Extend as needed
  ]
    .filter((url): url is string => typeof url === "string")
    .map((url) => ({ url }));
  const description = article.metadata?.description
    ? String(article.metadata?.description)
    : "Article hosted using Pantheon Content Cloud";

  const authors: string[] = [];
  let publishedTime: number | null = article.publishedDate;

  // Collecting data from metadata fields
  Object.entries(article.metadata || {}).forEach(([k, v]) => {
    const key = k.toLowerCase().trim();

    switch (key) {
      case "author": {
        if (typeof v === "string") {
          authors.push(v);
        }
        break;
      }
      case "complex-author": {
        if (typeof v === "string") {
          const authorName = getAuthorById(v)?.label;

          if (authorName) {
            authors.push(v);
          }
        }
        break;
      }
      case "date": {
        if (isDateInputObject(v)) {
          // Prefer the date from the metadata, if it exists
          publishedTime = parseInt(v.msSinceEpoch);
        }
        break;
      }
    }
  });

  return {
    title: article.title,
    description,
    openGraph: {
      type: "website",
      title: article.title || undefined,
      images: imageProperties,
      description,
      article: {
        authors: authors,
        tags: tags,
        ...(publishedTime && {
          publishedTime: new Date(publishedTime).toISOString(),
        }),
      },
    } satisfies OpenGraph,
  };
}