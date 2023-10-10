import { Article } from "@pantheon-systems/pcc-sdk-core/types";
import type { Options as MarkdownItOptions } from "markdown-it";
// @ts-expect-error - no types
import MarkdownIt from "markdown-it/dist/markdown-it.js";
import { computed, defineComponent, h, PropType } from "vue-demi";
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

const MarkdownRenderer = defineComponent({
  name: "VueMarkdown",
  props: {
    source: {
      type: String,
      required: true,
    },
    options: {
      type: Object as PropType<MarkdownItOptions>,
      default: () => ({}),
      required: false,
    },
  },
  setup(props, { attrs }) {
    const md = new MarkdownIt(props.options);

    const content = computed(() => {
      const src = props.source;
      return md?.render(src);
    });

    return () =>
      h("div", {
        ...attrs,
        innerHTML: content.value,
      });
  },
});

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
          ? h(MarkdownRenderer, {
              source: article.content || "",
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
