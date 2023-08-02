import { Article, PantheonAPI } from "@pantheon-systems/pcc-react-sdk";

export const pantheonAPIOptions = {
  resolvePath: (article: Article) => `/articles/${article.id}`,
};

export default PantheonAPI(pantheonAPIOptions);
