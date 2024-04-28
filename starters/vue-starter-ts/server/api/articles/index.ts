import { PCCConvenienceFunctions } from "@pantheon-systems/pcc-vue-sdk";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  let { pageSize, cursor } = query;
  return await PCCConvenienceFunctions.getPaginatedArticles(
    {
      publishingLevel: "PRODUCTION",
      ...(pageSize && { pageSize: pageSize as number }),
      ...(cursor && { cursor: cursor as number }),
    },
    {
      publishStatus: "published",
    },
  );
});
