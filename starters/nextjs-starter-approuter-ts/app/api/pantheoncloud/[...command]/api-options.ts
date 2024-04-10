import { PantheonAPIOptions } from "@pantheon-systems/pcc-sdk-core";
import { serverSmartComponentMap } from "../../../../components/smart-components/server-components";

export const pantheonAPIOptions: PantheonAPIOptions = {
  resolvePath: (article) => `/articles/${article.slug || article.id}`,
  getSiteId: () => process.env.PCC_SITE_ID,
  smartComponentMap: serverSmartComponentMap,
};
