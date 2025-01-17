import {
  PantheonAPI,
  PantheonAPIOptions,
  PCCConvenienceFunctions,
  Site,
} from "@pantheon-systems/pcc-react-sdk";
import { Article } from "@pantheon-systems/pcc-react-sdk/dist/types";
import { NextApiRequest, NextApiResponse } from "next";
import { serverSmartComponentMap } from "../../../components/smart-components";
import { getAuthorById, listAuthors } from "../../../lib/pcc-metadata-groups";
import { getArticleURLFromSite } from "../../../lib/utils";

export function getPantheonAPIOptions(site: Site) {
  return {
    resolvePath: (article: Partial<Article> & Pick<Article, "id">) =>
      getArticleURLFromSite(article, site),
    smartComponentMap: serverSmartComponentMap,
    componentPreviewPath: (componentName: string) =>
      `/component-preview/${componentName}`,
    metadataGroups: [
      {
        label: "Author",
        groupIdentifier: "AUTHOR",
        schema: {
          name: "string" as const,
          image: "file" as const,
        },
        get: getAuthorById,
        list: listAuthors,
      },
    ],
  };
}

export default async function apiHandler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // Get the site
  const site = await PCCConvenienceFunctions.getSite();
  // Create the options for the PantheonAPI
  const options = getPantheonAPIOptions(site);
  // Create the handler for the PantheonAPI
  const handler = PantheonAPI(options);
  // Handle the request
  return handler(req, res);
}
