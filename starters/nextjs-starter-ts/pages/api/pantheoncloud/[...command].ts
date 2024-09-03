import {
  PantheonAPI,
  PantheonAPIOptions,
} from "@pantheon-systems/pcc-react-sdk";
import { serverSmartComponentMap } from "../../../components/smart-components";

export const pantheonAPIOptions: PantheonAPIOptions = {
  resolvePath: (article) => `/articles/${article.slug || article.id}`,
  smartComponentMap: serverSmartComponentMap,
  componentPreviewPath: (componentName) =>
    `/component-preview/${componentName}`,
};

export default PantheonAPI(pantheonAPIOptions);
