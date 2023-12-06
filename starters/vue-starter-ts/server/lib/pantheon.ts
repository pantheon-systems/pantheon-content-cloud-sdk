import {
  PantheonClient,
  PantheonClientConfig,
  type SmartComponentMap,
} from "@pantheon-systems/pcc-vue-sdk";

const { PCC_SITE_ID, PCC_API_KEY } = process.env;

export const getPantheonClient = (options?: Partial<PantheonClientConfig>) => {
  if (!PCC_SITE_ID) {
    throw new Error("Missing PCC_SITE_ID");
  }

  if (!PCC_API_KEY) {
    throw new Error("Missing PCC_API_KEY");
  }

  return new PantheonClient({
    siteId: PCC_SITE_ID,
    apiKey: PCC_API_KEY,
    ...options,
  });
};

export const smartComponentMap = {
  LEAD_CAPTURE: {
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
} satisfies SmartComponentMap;
