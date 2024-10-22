import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

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
  const imageProperties = [
    article.metadata?.image,
    article.metadata?.["Hero Image"],
    // Extend as needed
  ]
    .filter((url) => typeof url === "string")
    .map((url) => ({ url }));
  const description = article.metadata?.description
    ? String(article.metadata?.description)
    : "Article hosted using Pantheon Content Cloud";

  let authors = [];
  let publishedTime = article.publishedDate;

  // Collecting data from metadata fields
  Object.entries(article.metadata || {}).forEach(([k, v]) => {
    const key = k.toLowerCase().trim();

    switch (key) {
      case "author": {
        if (typeof v === "string") {
          authors = [v];
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
      title: article.title,
      images: imageProperties,
      description,
      article: {
        authors: authors,
        tags: tags,
        ...(publishedTime && {
          publishedTime: new Date(publishedTime).toISOString(),
        }),
      },
    },
  };
}
