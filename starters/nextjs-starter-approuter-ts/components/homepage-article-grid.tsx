import { PCCConvenienceFunctions } from "@pantheon-systems/pcc-react-sdk/server";
import { PostGrid } from "./grid";

export default async function HomepageArticleGrid() {
  const articles = await PCCConvenienceFunctions.getAllArticles({
    publishingLevel: "PRODUCTION",
  });

  return <PostGrid data={articles} />;
}
