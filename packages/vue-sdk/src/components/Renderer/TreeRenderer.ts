import { defineComponent, h, PropType, resolveComponent } from "vue-demi";
import { JSONElement } from ".";
import {
  getStyleObjectFromString,
  unescapeHTMLEntities,
} from "../../utils/renderer";

export default defineComponent({
  name: "TreeRenderer",
  props: {
    x: {
      type: Object as PropType<JSONElement | JSONElement[]>,
      required: true,
    },
  },
  render() {
    const { x } = this.$props;

    if (Array.isArray(x)) {
      return x.map((span) => h(resolveComponent("TreeRenderer"), { x: span }));
    }

    if (x == null) return null;

    const textContent = typeof x === "string" ? x : x.data;
    const styles = getStyleObjectFromString(x?.style);
    const isSuperscript = Boolean(styles["vertical-align"] === "super");
    const isSubscript = Boolean(styles["vertical-align"] === "sub");

    const articleComponents = ["li", "tr", "td"];

    if (articleComponents.includes(x.tag)) {
      return h(
        x.tag,
        { style: styles, attrs: x.attrs },
        x.children
          ? h(resolveComponent("TreeRenderer"), {
              x: x.children,
            })
          : [],
      );
    }

    if (textContent != null) {
      const tag = isSuperscript ? "sup" : isSubscript ? "sub" : "span";
      return h(tag, { style: styles }, unescapeHTMLEntities(textContent));
    }

    if (x.tag === "span" && x.data == null) {
      return h("span", {}, [
        x.children
          ? h(resolveComponent("TreeRenderer"), {
              x: x.children,
            })
          : null,
      ]);
    }

    if (x.tag === "a") {
      return h("a", {
        attrs: {
          href: x.href,
          target: "_blank",
          rel: "noopener noreferrer",
        },
        style: styles,
        domProps: { innerHTML: x.data },
      });
    }

    if (x.tag === "img" || x.tag === "image") {
      return h("img", {
        attrs: { src: x.src, alt: x.alt, title: x.title },
      });
    }

    if (x.type === "BLOCKQUOTE") {
      return h("blockquote", {}, [
        h("p", { attrs: { dir: "ltr" } }, "QUOTE TEXT"),
        h("p", { attrs: { dir: "ltr" } }, "- QUOTE ATTRIBUTION"),
      ]);
    }

    return null;
  },
});
