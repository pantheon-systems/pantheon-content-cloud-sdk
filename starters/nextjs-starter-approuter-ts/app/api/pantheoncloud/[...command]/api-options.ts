import { PantheonAPIOptions } from "@pantheon-systems/pcc-react-sdk/server";
import { serverSmartComponentMap } from "../../../../components/smart-components/server-components";
import {
  getAuthorById,
  listAuthors,
} from "../../../../lib/pcc-metadata-groups";

export const pantheonAPIOptions: PantheonAPIOptions = {
  resolvePath: (article) => `/articles/${article.slug || article.id}`,
  getSiteId: () => process.env.PCC_SITE_ID as string,
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
