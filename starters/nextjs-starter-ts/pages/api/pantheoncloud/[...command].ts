import {
  PantheonAPI,
  PantheonAPIOptions,
} from "@pantheon-systems/pcc-react-sdk";
import { serverSmartComponentMap } from "../../../components/smart-components";

const authors = [
  {
    id: 1,
    name: "James T. Kirk",
    image: "https://en.wikipedia.org/wiki/File:William_Shatner_Star_Trek.JPG",
  },
  {
    id: 2,
    name: "Spock",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Leonard_Nimoy_as_Spock_1967.jpg/440px-Leonard_Nimoy_as_Spock_1967.jpg",
  },
];

export const pantheonAPIOptions: PantheonAPIOptions = {
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
      get: (id: string) => authors.find((x) => x.id?.toString() === id),
      list: () => authors,
    },
  ],
};

export default PantheonAPI(pantheonAPIOptions);
