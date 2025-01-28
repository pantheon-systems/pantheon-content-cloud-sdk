import {
  PantheonAPI,
  PantheonAPIOptions,
} from "@pantheon-systems/pcc-react-sdk";
import { getArticleURLFromSiteWithOptions } from "@pantheon-systems/pcc-react-sdk/server";
import { serverSmartComponentMap } from "../../../components/smart-components";
import { getAuthorById, listAuthors } from "../../../lib/pcc-metadata-groups";

export const pantheonAPIOptions: PantheonAPIOptions = {
  resolvePath: getArticleURLFromSiteWithOptions({
    // The base path to use for the URL.
    basePath: "/articles",
    // The maximum depth to include in the URL. We need it to include everything
    maxDepth: -1,
  }),
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

export default PantheonAPI(pantheonAPIOptions);
