import {
  PCCConvenienceFunctions,
  updateConfig,
} from "@pantheon-systems/pcc-react-sdk/server";
import { PostGrid } from "./grid";

updateConfig({
  pccHost: process.env.PCC_HOST,
  siteId: process.env.PCC_SITE_ID,
  token: process.env.PCC_TOKEN,
});

export default async function HomepageArticleGrid() {
  const articles = await PCCConvenienceFunctions.getAllArticles({
    publishingLevel: "PRODUCTION",
  });

  return <PostGrid data={articles} />;
}
