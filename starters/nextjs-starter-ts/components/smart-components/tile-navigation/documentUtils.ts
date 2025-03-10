import { Props } from "./index";

/**
 * Extracts document IDs from various input formats
 * 
 * This utility function handles multiple input formats and safely extracts document IDs.
 * It supports:
 * - Array of strings: Each string is a document ID or Google Doc URL
 * - Single string: A single document ID or Google Doc URL
 * - Object with 'item' property: Complex object from CMS fields
 * - Record object: Key-value pairs where values contain document IDs
 * 
 * It also handles Google Doc URLs and extracts the document ID from them.
 * 
 * @param {Props["documentIds"]} documentIds - The document IDs in various formats
 * @returns {string[]} Array of clean document IDs
 */
export function getDocIDsFromProps(documentIds: Props["documentIds"]): string[] {
  // Safely extract document links or IDs, handling different possible formats
  let docLinksOrIDs: string[] = [];

  try {
    if (Array.isArray(documentIds)) {
      // If documentIds is already an array
      docLinksOrIDs = documentIds
        .map((doc) => {
          if (typeof doc === "string") return doc;
          if (doc && typeof doc === "object" && "item" in doc)
            return String(doc.item);
          return "";
        })
        .filter(Boolean);
    } else if (documentIds && typeof documentIds === "object") {
      // If documentIds is an object (but not array)
      if ("item" in documentIds) {
        // If it's a single item object
        const item = documentIds.item;
        if (item) {
          docLinksOrIDs = [String(item)];
        }
      } else {
        // Try to convert object to array if possible
        try {
          const values = Object.values(documentIds);
          docLinksOrIDs = values
            .map((val) => {
              if (typeof val === "string") return val;
              if (val && typeof val === "object" && "item" in val)
                return String(val.item);
              return "";
            })
            .filter(Boolean);
        } catch (e) {
          console.error("Error parsing documentIds object values:", e);
          // Return empty array instead of failing completely
          return [];
        }
      }
    } else if (typeof documentIds === "string") {
      // If it's a single string
      docLinksOrIDs = [documentIds];
    }

    // The docLinks contains the GDoc links of the docs.
    // So if it has the structure of https://docs.google.com/document/d/<docId>/*
    // We need to extract the <docId> and use that to fetch the article data.
    const docIds = docLinksOrIDs
      .map((linkOrDocID) => {
        try {
          // Handle Google Doc links
          const match = linkOrDocID.match(
            /https:\/\/docs\.google\.com\/document\/d\/([^/]+)/,
          );
          // If there is a match, return the <docId>
          // Otherwise, return the linkOrDocID, with the assumption that it is already the <docId>
          return match ? match[1] : linkOrDocID;
        } catch (e) {
          console.error("Error parsing document link:", linkOrDocID, e);
          return "";
        }
      })
      .filter(Boolean);

    return docIds;
  } catch (e) {
    // Catch any unexpected errors to prevent component from crashing
    console.error("Unexpected error in getDocIDsFromProps:", e);
    return [];
  }
}