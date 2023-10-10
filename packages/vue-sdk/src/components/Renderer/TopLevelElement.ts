import { TreePantheonContent } from "@pantheon-systems/pcc-sdk-core/types";
import { DefineComponent, defineComponent, h, PropType } from "vue-demi";
import TreeRenderer from "./TreeRenderer";

export type SmartComponentMap = {
  // Can't know prop types of component, so we use any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: InstanceType<DefineComponent<any, any, any>>;
};

export default defineComponent({
  name: "TopLevelElement",
  props: {
    element: {
      type: Object as PropType<TreePantheonContent>,
      required: true,
    },
    smartComponentMap: {
      type: Object as PropType<SmartComponentMap>,
      required: false,
    },
  },
  render() {
    const { element, smartComponentMap } = this.$props;

    if (element.tag === "hr") {
      return h("hr");
    }

    const children = element.children
      ? h(TreeRenderer, {
          x: element.children,
          smartComponentMap,
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
      if (element.children?.some((x) => x.tag === "component")) {
        // P cannot be parent of block-level elements
        return h("div", {}, children);
      }

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
        smartComponentMap,
      });
    }
    return null;
  },
});
