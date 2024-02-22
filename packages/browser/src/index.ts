import { PantheonClient } from "@pantheon-systems/pcc-sdk-core";
import PCCArticle from "./elements/pcc-article";

type Args = {
  siteId?: string;
  token?: string;
  pccHost?: string;
};

const { siteId, token, pccHost } = document.currentScript?.dataset as Args;

// Validate required arguments
if (!siteId) {
  throw new Error(
    "Missing Pantheon Content Cloud site ID. Provide it as a data-site-id attribute on the script tag.",
  );
}
if (!token) {
  throw new Error(
    "Missing Pantheon Content Cloud Token. Provide it as a data-token attribute on the script tag.",
  );
}

// Initialize the PantheonClient
const pantheonClient = new PantheonClient({
  siteId,
  token,
  pccHost,
});

// Expose the PantheonClient on the window object
if (!window?.__PANTHEON_CLIENT) window.__PANTHEON_CLIENT = pantheonClient;

// Register the custom element
customElements.define("pcc-article", PCCArticle);
