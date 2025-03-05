import { Props } from "./index";

export function getDocIDsFromProps(documentIds: Props["documentIds"]): string[] {
  // Safely extract document links or IDs, handling different possible formats
  let docLinksOrIDs: string[] = [];

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
      docLinksOrIDs = [String(documentIds.item)];
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
        console.error("Error parsing documentIds:", e);
      }
    }
  } else if (typeof documentIds === "string") {
    // If it's a single string
    docLinksOrIDs = [documentIds];
  }

  // The docLinks contains the GDoc links of the docs.
  // So if it has the strucutre of https://docs.google.com/document/d/<docId>/*
  // We need to extract the <docId> and use that to fetch the article data.
  const docIds = docLinksOrIDs
    .map((linkOrDocID) => {
      const match = linkOrDocID.match(
        /https:\/\/docs\.google\.com\/document\/d\/(.*)\//,
      );
      // If there is a match, return the <docId>
      // Otherwise, return the linkOrDocID, with the assumption that it is already the <docId>
      return match ? match[1] : linkOrDocID;
    })
    .filter(Boolean);

  return docIds;
}