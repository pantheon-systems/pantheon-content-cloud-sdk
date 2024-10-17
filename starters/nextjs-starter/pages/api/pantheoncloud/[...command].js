import { PantheonAPI } from "@pantheon-systems/pcc-react-sdk";
import { serverSmartComponentMap } from "../../../components/smart-components";
import { getAuthorById, listAuthors } from "../../../lib/pcc-metadata-groups";

export const pantheonAPIOptions = {
  resolvePath: (article) => `/articles/${article.slug || article.id}`,
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
