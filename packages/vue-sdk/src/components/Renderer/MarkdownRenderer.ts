import type { Options as MarkdownItOptions } from "markdown-it";
// @ts-expect-error - no types
import MarkdownIt from "markdown-it/dist/markdown-it.js";
import { computed, defineComponent, h, PropType } from "vue-demi";

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

export default MarkdownRenderer;
