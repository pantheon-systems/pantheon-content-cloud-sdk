import { readFileSync } from "fs";
import { getArticleBySlugOrId } from "@pantheon-systems/pcc-vue-sdk";
import { getPantheonClient } from "../../lib/pantheon";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  const { publishingLevel = "PRODUCTION" } = getQuery(event);

  if (!id || typeof id !== "string") {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing id",
    });
  }

  if (publishingLevel !== "PRODUCTION" && publishingLevel !== "REALTIME") {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid publishing level",
    });
  }

  const article = await getArticleBySlugOrId(getPantheonClient(), id, {
    publishingLevel: publishingLevel,
  });

  const content = readFileSync(
    "/Users/andrew/dev/pg/pantheon/pantheon-content-cloud/test.json",
    "utf-8",
  );

  article.content = content;

  return article;
});
