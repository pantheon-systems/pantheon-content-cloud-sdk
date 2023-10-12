import { getArticles } from "@pantheon-systems/pcc-vue-sdk";
import { getPantheonClient } from "~/lib/pantheon";

export default defineEventHandler(async () => {
  return await getArticles(
    getPantheonClient(),
    {
      publishingLevel: "PRODUCTION",
    },
    {
      publishStatus: "published",
    },
  );
});
