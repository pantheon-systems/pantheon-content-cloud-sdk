import {
  PantheonAPI,
  PantheonAPIOptions,
  PantheonClient,
  PantheonClientConfig,
} from "@pantheon-systems/pcc-react-sdk";
import { serverSmartComponentMap } from "../../../components/smart-components";

export const pantheonAPIOptions: PantheonAPIOptions = {
  getPantheonClient: (props?: Partial<PantheonClientConfig>) =>
    new PantheonClient({
      pccHost: process.env.PCC_HOST,
      siteId: process.env.PCC_SITE_ID,
      apiKey: process.env.PCC_API_KEY,
      ...props,
    }),
  resolvePath: (article) => `/articles/${article.slug || article.id}`,
  getSiteId: () => process.env.PCC_SITE_ID,
  smartComponentMap: serverSmartComponentMap,
};

export default PantheonAPI(pantheonAPIOptions);
