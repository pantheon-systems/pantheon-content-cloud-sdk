import { PantheonClient } from "@pantheon-systems/pcc-react-sdk";

export const pantheonClient = new PantheonClient({
  pccHost: process.env.PCC_HOST,
  siteId: process.env.PCC_SITE_ID,
  apiKey: process.env.PCC_API_KEY,
});

export const buildPantheonClientWithGrant = (pccGrant) => {
  return new PantheonClient({
    pccHost: process.env.PCC_HOST,
    siteId: process.env.PCC_SITE_ID,
    apiKey: process.env.PCC_API_KEY,
    pccGrant,
  });
};
