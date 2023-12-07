import type { Options as MarkdownItOptions, Token } from "markdown-it";
import MarkdownIt from "markdown-it";
import MarkdownItAnchor from "markdown-it-anchor";
import MarkdownItAttrs from "markdown-it-attrs";
import {
  computed,
  defineComponent,
  h,
  PropType,
  defineCustomElement,
  onMounted,
} from "vue-demi";
import type { ComponentMap, SmartComponentMap } from "./";

const MarkdownRenderer = defineComponent({
  name: "VueMarkdown",
  props: {
    source: {
      type: String,
      required: true,
    },
    smartComponentMap: {
      type: Object as PropType<SmartComponentMap>,
      default: () => ({}),
      required: false,
    },
    componentMap: {
      type: Object as PropType<ComponentMap>,
      default: () => ({}),
      required: false,
    },
  },
  setup(props) {
    onMounted(() => {
      const styleTags = document.querySelectorAll("style");
      const styleLinks = document.querySelectorAll(
        "link[rel=stylesheet]",
      ) as NodeListOf<HTMLLinkElement>;

      // Taking the web components approach means we can't use the components in SSR
      // TODO: Figure out how to make this work with SSR
      // https://getpantheon.atlassian.net/browse/PCC-763
      customElements.define(
        "pcc-component",
        buildPccCustomElement(props.smartComponentMap, styleTags, styleLinks),
      );
    });
  },
  render() {
    const props = this.$props;
    const attrs = this.$attrs;

    const md = new MarkdownIt({
      html: true,
    } satisfies MarkdownItOptions);
    md.use(MarkdownItAttrs);
    md.use(MarkdownItAnchor);
    const content = computed(() => {
      const src = props.source;
      return md?.render(src);
    });

    return h("div", {
      ...attrs,
      innerHTML: content.value,
    });
  },
});

interface ComponentProps extends Record<string, unknown> {
  id: string;
  attrs: string;
  type: string;
}

const buildPccCustomElement = (
  smartComponentMap: SmartComponentMap,
  styles: NodeListOf<HTMLStyleElement>,
  styleLinks: NodeListOf<HTMLLinkElement>,
) => {
  return defineCustomElement({
    props: {
      id: {
        type: String,
        required: true,
      },
      attrs: {
        type: String,
        required: true,
      },
      type: {
        type: String,
        required: true,
      },
    },
    render(props: ComponentProps) {
      const { attrs, type } = props;

      const component = smartComponentMap?.[type];

      const decodedAttrs = isomorphicBase64Decode(attrs);

      return h(
        "div",
        {
          class: "pcc-component",
        },
        [
          // Browsers will dedupe these requests automatically
          ...Array.from(styleLinks).map((link) =>
            h("link", {
              rel: "stylesheet",
              href: link.href,
            }),
          ),
          component
            ? h(component, decodedAttrs)
            : h("u", {}, `PCC Component - ${type}`),
        ],
      );
    },
    styles: Array.from(styles).map((style) => style.innerHTML),
  });
};

function isomorphicBase64Decode(str: string): Record<string, unknown> {
  try {
    let stringifiedJSON: string | undefined;
    if (typeof Buffer !== "undefined") {
      stringifiedJSON = Buffer.from(str, "base64").toString("utf8");
    } else if (typeof atob !== "undefined") {
      stringifiedJSON = atob(str);
    }

    if (!stringifiedJSON) throw new Error("Failed to decode base64 string");

    return JSON.parse(stringifiedJSON);
  } catch (e) {
    console.error(e);
    return {};
  }
}

export default MarkdownRenderer;
