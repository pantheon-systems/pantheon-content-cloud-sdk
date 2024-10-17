import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { getAuthorById } from "./pcc-metadata-groups";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatDate(input) {
  const date = new Date(input);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function isDateInputObject(v) {
  return v.msSinceEpoch != null;
}

export function getSeoMetadata(article) {
  const tags = article.tags && article.tags.length > 0 ? article.tags : [];
  let publishedTime = null;

  // Collecting data from metadata fields. Identifies the key in a case in-sensitive way.
  Object.entries(article.metadata || {}).forEach(([key, val]) => {
    if (key.toLowerCase().trim() === "date" && isDateInputObject(val))
      publishedTime = new Date(val.msSinceEpoch).toISOString();
  });

  const authorId = article.metadata.author;
  const authorName = authorId ? getAuthorById(authorId)?.name : undefined;

  const imageProperties = [
    article.metadata?.["Hero Image"],
    // Extend as needed
  ]
    .filter((url) => typeof url === "string")
    .map((url) => ({ url }));

  const description = "Article hosted using Pantheon Content Publisher";

  return {
    title: article.title,
    description,
    tags,
    authors: authorName
      ? [
          {
            name: authorName,
          },
        ]
      : null,
    publishedTime,
    openGraph: {
      type: "website",
      title: article.title,
      description,
      images: imageProperties,
    },
  };
}
