import { PantheonClient } from "@pantheon-systems/pcc-sdk-core";
import PCCArticle from "./elements/pcc-article";

type Args = {
  siteId?: string;
  apiKey?: string;
  pccHost?: string;
};

const { siteId, apiKey, pccHost } = document.currentScript?.dataset as Args;

// Validate required arguments
if (!siteId) {
  throw new Error(
    "Missing Pantheon Content Cloud site ID. Provide it as a data-site-id attribute on the script tag.",
  );
}
if (!apiKey) {
  throw new Error(
    "Missing Pantheon Content Cloud API Key. Provide it as a data-api-key attribute on the script tag.",
  );
}

// Initialize the PantheonClient
const pantheonClient = new PantheonClient({
  siteId,
  apiKey,
  pccHost,
});

// Expose the PantheonClient on the window object
if (!window?.__PANTHEON_CLIENT) window.__PANTHEON_CLIENT = pantheonClient;

// Register the custom element
customElements.define("pcc-article", PCCArticle);
