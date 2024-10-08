import { ArticleWithoutContent } from "@pantheon-systems/pcc-react-sdk";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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
  const tags = article.tags && article.tags.length > 0 ? article.tags : [];
  let publishedTime = null;

  // Collecting data from metadata fields
  Object.entries(article.metadata || {}).forEach(([key, val]) => {
    if (key.toLowerCase().trim() === "date" && isDateInputObject(val))
      publishedTime = new Date(val.msSinceEpoch).toISOString();
  });

  const imageProperties = [
    article.metadata?.["Hero Image"],
    // Extend as needed
  ]
    .filter((url): url is string => typeof url === "string")
    .map((url) => ({ url }));

  const authorName = article.metadata.author?.name;

  return {
    title: article.title,
    description: "Article hosted using Pantheon Content Cloud",
    tags,
    authors: authorName ? [authorName] : undefined,
    publishedTime,
    images: imageProperties,
  };
}
