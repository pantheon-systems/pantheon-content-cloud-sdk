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

function doesCHildContainArticle(
  child: any,
  article: Partial<Article> & Pick<Article, "id">,
) {
  let categoryTree: string[] = [];
  let contains = false;

  // If the child is an article, check if it matches the article id
  if (child.type === "article") {
    if (child.id === article.id) {
      contains = true;
    }

    return { contains, categoryTree };
  }

  // Iterate over the category and its children
  for (const childOfChild of child.children) {
    // If the child is another category, we need to iterate over its children
    if (childOfChild.type === "category") {
      const result = doesCHildContainArticle(childOfChild, article);
      if (result.contains) {
        // Add the current category name to the category tree
        categoryTree.push(child.name);
        // Append the result of the recursive call
        categoryTree.push(...result.categoryTree);
        contains = true;
        // Break out of the loop
        break;
      }
    } else {
      // If the child is an article, check if it matches the article id
      if (childOfChild.id === article.id) {
        contains = true;
        // If it does, append the result's category tree to the current category tree
        categoryTree.push(child.name);
        // Break out of the loop
        break;
      }
    }
  }

  return { contains, categoryTree };
}

export function getArticlePathFromContentStrucuture(
  article: Partial<Article> & Pick<Article, "id">,
  site: Site,
) {
  const defaultPath: string[] = [];
  // If the site is not defined or the content structure is not defined or if the active key is not defined, return the default path
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
  if (typeof active !== "object" || !Array.isArray(active) || !active.length) {
    return defaultPath;
  }
  // Iterate over the active array
  for (const category of active) {
    // The categories can be nested, so we need to find the relevant list of categories that contain the articleId
    // We need to iterate over all the categories, do the same for all its children. Keep doing this until we find the articleId
    const { contains, categoryTree } = doesCHildContainArticle(
      category,
      article,
    );
    if (!contains) {
      continue;
    }
    // If the item is found, return the path as a normalized path
    if (categoryTree && categoryTree.length > 0) {
      // normalise the name of each category in the categoryTree
      const normalisedCategoryTree = categoryTree.map((category) =>
        category
          .replace(/ /g, "-")
          .replace(/[^a-zA-Z0-9-]/g, "")
          .toLowerCase(),
      );
      // Return it
      return normalisedCategoryTree;
    }
  }

  return defaultPath;
}

export function getArticleURLFromSite(
  article: Partial<Article> & Pick<Article, "id">,
  site: Site,
  basePath = "/articles",
) {
  // Get the article path
  const articlePath = getArticlePathFromContentStrucuture(article, site);
  // Add the basePath before the articlePath and the article slug or id at the end
  if (articlePath.length > 0) {
    return `${basePath}/${articlePath.join("/")}/${article.slug || article.id}`;
  }
  return `${basePath}/${article.slug || article.id}`;
}
