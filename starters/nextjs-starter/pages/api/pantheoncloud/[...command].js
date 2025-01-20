import {
  PantheonAPI,
  PCCConvenienceFunctions,
} from "@pantheon-systems/pcc-react-sdk";
import { serverSmartComponentMap } from "../../../components/smart-components";
import { getAuthorById, listAuthors } from "../../../lib/pcc-metadata-groups";
import { getArticleURLFromSite } from "../../../lib/utils";

export function getPanthonAPIOptions(site) {
  return {
    resolvePath: (article) => getArticleURLFromSite(article, site),
    smartComponentMap: serverSmartComponentMap,
    componentPreviewPath: (componentName) =>
      `/component-preview/${componentName}`,
    metadataGroups: [
      {
        label: "Author",
        groupIdentifier: "AUTHOR",
        schema: {
          name: "string",
          image: "file",
        },
        get: getAuthorById,
        list: listAuthors,
      },
    ],
  };
}

export default async function apiHandler(req, res) {
  // Fetch the site
  const site = await PCCConvenienceFunctions.getSite();
  // Create the options for the PantheonAPI
  const options = getPanthonAPIOptions(site);
  // Create the handler for the PantheonAPI
  const handler = PantheonAPI(options);
  // Call the handler
  return handler(req, res);
}
