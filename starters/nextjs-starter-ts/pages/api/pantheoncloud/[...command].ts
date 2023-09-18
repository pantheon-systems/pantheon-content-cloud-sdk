import {
  PantheonAPI,
  PantheonAPIOptions,
  PantheonClient,
  PantheonClientConfig,
} from "@pantheon-systems/pcc-react-sdk";
import LeadCapture from "../../../components/smart-components/lead-capture";

export const pantheonAPIOptions: PantheonAPIOptions = {
  getPantheonClient: (props?: Partial<PantheonClientConfig>) =>
    new PantheonClient({
      pccHost: process.env.PCC_HOST,
      siteId: process.env.PCC_SITE_ID,
      apiKey: process.env.PCC_API_KEY,
      ...props,
    }),
  resolvePath: (article) => `/articles/${article.slug || article.id}`,
  smartComponentMap: {
    LEAD_CAPTURE: {
      reactComponent: LeadCapture,
      title: "Lead Capture Form",
      iconUrl: null,
      fields: {
        title: {
          displayName: "Title",
          required: true,
          type: "string",
        },
        body: {
          displayName: "Body",
          required: false,
          type: "string",
        },
      },
    },
  },
};

export default PantheonAPI(pantheonAPIOptions);
