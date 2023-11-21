import { PantheonClient } from "@pantheon-systems/pcc-react-sdk";

export const buildPantheonClientWithGrant = (pccGrant: string) => {
  return new PantheonClient({
    pccHost: process.env.PCC_HOST,
    siteId: process.env.PCC_SITE_ID,
    apiKey: "not-needed-on-client",
    pccGrant,
  });
};
