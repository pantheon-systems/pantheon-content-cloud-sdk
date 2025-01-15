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

  const authors = [];
  let publishedTime = article.publishedDate;

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
      case "date": {
        if (isDateInputObject(v)) {
          // Prefer the date from the metadata, if it exists
          publishedTime = parseInt(v.msSinceEpoch);
        }
        break;
      }
      case "complex-author":
        if (typeof v === "string") {
          const authorName = getAuthorById(v)?.label;

          if (authorName) {
            authors.push(v);
          }
        }
        break;
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


function doesChildContainArticle(child, article) {
  let categoryTree = [];
  let contains = false;

  // If the child is an article, check if it matches the article
  if (child.type === "article") {
    if (child.id === article.id) {
      contains = true;
    }
    // If the child is an article, but it doesn't match the article, return false
    return {contains: contains, categoryTree: categoryTree};
  }

  // Iterate over the category and its children
  for (const childOfChild of child.children) {
    // If the child is another category, we need to iterate over its children
    if (childOfChild.type === "category") {
      const result = doesChildContainArticle(childOfChild, article);
      if (result.contains) {
        // Add the current category name to the categoryTree
        categoryTree.push(child.name);
        // If it does, append the result's categoryTree to the categoryTree
        categoryTree.push(...result.categoryTree);
        contains = true;
        // Break out of the loop
        break;
      }
    } else {
      // If the child is an article, check if it matches the article
      if (childOfChild.id === article.id) {
        // If it does, append the result's categoryTree to the categoryTree
        categoryTree.push(child.name);
        contains = true;
        // Break out of the loop
        break;
      }
    }
  }

  return {contains: contains, categoryTree: categoryTree};
}

export function getArticlePathFromContentStructure(article, site) {
  const defaultPath = [];
  // If the site is not defined or the content strucure is not defined, return the default path
  if (!site || !site.contentStructure || !site.contentStructure.active) {
    return defaultPath;
  }
  // If the active key is present, it will be an array of objects. Its structure is as follows:
  // {
  //   "id": "string",
  //   "name": "string",
  //   "type": "string"
  //   "children": [
  //     {
  //       "id": "string",
  //       "name": "string",
  //       "type": "string"
  //     }
  //   ]
  // }
  // type will be one of the following: "category" or "article"
  // We need to find the article object that contains the articleId
  const active = site.contentStructure.active;
  if (!active || typeof active !== "object" || !Array.isArray(active) || active.length === 0) {
    return defaultPath;
  }
  // Iterate over the active array
  for (const category of active) {
    // The categories can be nested, so we need to find the relevant list of categories that contain the articleId
    // We need to iterate over all the categories, do the same for all its children. Keep doing this until we find the articleId
    const {contains, categoryTree} = doesChildContainArticle(category, article);
    if (!contains) {
      continue;
    }
    // If the item is found, return the path as /articles/normalised-relevantCategory-name/articleId
    if (categoryTree && categoryTree.length > 0) {
      // normalise the name of each category in the categoryTree
      const normalisedCategoryTree = categoryTree.map((category) => category.replace(/ /g, "-").replace(/[^a-zA-Z0-9-]/g, "").toLowerCase());
      // Join the normalised category names with a "/"
      return normalisedCategoryTree;
    }
  }

  // If the article is not found, return the default path
  return defaultPath;
}

export function getArticleURLFromSite(article, site, basePath = "/articles") {
// Get the article path
const articlePath = getArticlePathFromContentStructure(article, site);
// Add the basePath before the articlePath and the article slug or id after the articlePath
return `${basePath}/${articlePath.join("/")}/${article.slug || article.id}`;
}
