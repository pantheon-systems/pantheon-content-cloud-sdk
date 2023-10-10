import { getArticle } from "@pantheon-systems/pcc-vue-sdk";
import { getPantheonClient } from "~/lib/pantheon-client";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");

  if (!id || typeof id !== "string") {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing id",
    });
  }

  return await getArticle(getPantheonClient(), id, {
    publishingLevel: "PRODUCTION",
  });
});
