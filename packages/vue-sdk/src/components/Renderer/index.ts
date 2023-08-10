import { Article } from "@pantheon-systems/pcc-sdk-core/types";
import { defineComponent, h, PropType } from "vue-demi";
import VueMarkdown from "vue-markdown-render";
import TopLevelElement from "./TopLevelElement";

export type JSONElement = {
  tag: string;
  data?: string;
  children?: JSONElement[];
  src?: string;
  alt?: string;
  style?: string[];
  title?: string;
  href?: string;
  type?: string;
  attrs?: Record<string, string>;
};

const Renderer = defineComponent({
  name: "Renderer",
  props: {
    article: {
      type: Object as PropType<Article>,
      required: true,
    },
  },
  setup(props) {
    const { article } = props;
    return () =>
      h("div", {}, [
        article.contentType === "TEXT_MARKDOWN"
          ? h(VueMarkdown, {
              source: article.content,
              options: {
                html: true,
              },
            })
          : (article.content ? JSON.parse(article.content) : []).map(
              (element: JSONElement) => {
                return h(TopLevelElement, {
                  element,
                });
              },
            ),
      ]);
  },
});

export default Renderer;
