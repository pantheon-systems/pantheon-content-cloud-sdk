import { ArticleWithoutContent } from "@pantheon-systems/pcc-react-sdk";
import { clsx, type ClassValue } from "clsx";
import { Metadata } from "next";
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

export function getSeoMetadata(article: ArticleWithoutContent): Metadata {
  const tags: string[] =
    article.tags && article.tags.length > 0 ? article.tags : [];
  const imageProperties = [
    article.metadata?.image,
    article.metadata?.["Hero Image"],
    // Extend as needed
  ]
    .filter((url): url is string => typeof url === "string")
    .map((url) => ({ url }));
  const description = article.metadata?.description
    ? String(article.metadata?.description)
    : "Article hosted using Pantheon Content Cloud";

  let authors: Metadata["authors"] = [];

  // Collecting data from metadata fields
  Object.entries(article.metadata || {}).forEach(([k, v]) => {
    const key = k.toLowerCase().trim();

    switch (key) {
      case "author": {
        if (typeof v === "string") {
          authors = [{ name: v }];
        }
        break;
      }
    }
  });

  return {
    title: article.title,
    description,
    keywords: tags,
    authors,
    openGraph: {
      type: "website",
      title: article.title,
      images: imageProperties,
      description,
    },
  };
}
