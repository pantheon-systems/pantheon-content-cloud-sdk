import { PantheonClient } from "@pantheon-systems/pcc-vue-sdk";

const { PCC_SITE_ID, PCC_TOKEN, PCC_HOST } = process.env;

export const getPantheonClient = (options) => {
  if (!PCC_SITE_ID) {
    throw new Error("Missing PCC_SITE_ID");
  }

  if (!PCC_TOKEN) {
    throw new Error("Missing PCC_TOKEN");
  }

  return new PantheonClient({
    siteId: PCC_SITE_ID,
    token: PCC_TOKEN,
    pccHost: PCC_HOST,
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
};
