import {
  PantheonAPI,
  PantheonAPIOptions,
  PantheonClient,
  PantheonClientConfig,
} from "@pantheon-systems/pcc-react-sdk";
import { serverSmartComponentMap } from "../../../components/smart-components";

export const pantheonAPIOptions: PantheonAPIOptions = {
  resolvePath: (article) => `/articles/${article.slug || article.id}`,
  getSiteId: () => process.env.PCC_SITE_ID,
  smartComponentMap: serverSmartComponentMap,
};

export default PantheonAPI(pantheonAPIOptions);
