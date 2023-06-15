import { getArticles, getArticle } from "@pcc/react";
import { pantheonClient } from "./PantheonClient";

export async function getAllArticles() {
  const posts = await getArticles(pantheonClient);

  return posts;
}

export async function getArticleById(id) {
  const post = await getArticle(pantheonClient, id);

  return post;
}
