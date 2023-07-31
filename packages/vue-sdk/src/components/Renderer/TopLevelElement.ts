import { h, defineComponent, PropType } from "vue-demi";
import TreeRenderer from "./TreeRenderer";
import { JSONElement } from ".";

export default defineComponent({
  name: "TopLevelElement",
  props: {
    element: {
      type: Object as PropType<JSONElement>,
      required: true,
    },
  },
  render() {
    const { element } = this.$props;

    if (element.tag === "hr") {
      return h("hr");
    }

    const children = element.children
      ? h(TreeRenderer, {
          x: element.children,
        })
      : [];

    const headerTags = ["h1", "h2", "h3", "h4", "h5", "h6"];

    if (headerTags.includes(element.tag)) {
      return h(element.tag, { attrs: element.attrs }, children);
    }

    if (element.tag === "table") {
      return h("table", { class: "text-black" }, [h("tbody", {}, children)]);
    }

    if (element.tag === "p" || element.tag === "span") {
      return h(element.tag, {}, children);
    }
    if (element.tag === "ul" && element.children?.length) {
      return h("ul", {}, children);
    }
    if (element.tag === "ol" && element.children?.length) {
      return h("ol", {}, children);
    }
    if (element.tag === "component") {
      return h(TreeRenderer, {
        x: element,
      });
    }
    return null;
  },
});
