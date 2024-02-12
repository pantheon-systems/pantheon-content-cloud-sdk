import { type Article } from "@pantheon-systems/pcc-sdk-core";
import { GET_ARTICLE_QUERY } from "../lib/queries";
import { RendererConfig, renderArticleToElement } from "./renderer";

class PCCArticle extends HTMLElement {
  constructor() {
    super();
  }

  async connectedCallback() {
    const id = this.getAttribute("id") || undefined;
    const slug = this.getAttribute("slug") || undefined;
    const disableStyles = this.getAttribute("disable-styles") != null;

    const config = {
      disableStyles,
    };

    if (!id && !slug) {
      throw new Error("PCC Article requires an id or slug attribute");
    }

    await this.fetchAndRenderArticle({ id, slug }, config);
  }

  private async fetchAndRenderArticle(
    {
      id,
      slug,
    }: {
      id?: string;
      slug?: string;
    },
    rendererConfig?: RendererConfig,
  ) {
    if (!window?.__PANTHEON_CLIENT) {
      throw new Error("Missing Pantheon Client");
    }

    const { article } = await window.__PANTHEON_CLIENT.query<{
      article: Article;
    }>(GET_ARTICLE_QUERY, {
      id,
      slug,
      contentType: "TREE_PANTHEON_V2",
    });

    return renderArticleToElement(article, this, rendererConfig);
  }
}

export default PCCArticle;
