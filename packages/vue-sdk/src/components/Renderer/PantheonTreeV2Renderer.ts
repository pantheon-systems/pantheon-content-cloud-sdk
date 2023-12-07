import { PantheonTreeNode } from "@pantheon-systems/pcc-sdk-core/types";
import { defineComponent, h, PropType, resolveComponent } from "vue-demi";
import { getStyleObjectFromString } from "../../utils/renderer";
import { ComponentMap, SmartComponentMap } from "./index";

const PantheonTreeRenderer = defineComponent({
  name: "PantheonTreeRenderer",
  props: {
    element: {
      type: Object as PropType<PantheonTreeNode>,
      required: true,
    },
    smartComponentMap: {
      type: Object as PropType<SmartComponentMap>,
      required: false,
    },
    componentMap: {
      type: Object as PropType<ComponentMap>,
      default: () => ({}),
      required: false,
    },
  },
  render() {
    const { element, smartComponentMap, componentMap } = this.$props;

    const children =
      element.children?.map((el) =>
        h(resolveComponent("PantheonTreeRenderer"), {
          element: el,
          smartComponentMap,
          componentMap,
        }),
      ) ?? [];

    if (element.tag === "component") {
      const componentType =
        (element.attrs?.type as string | undefined)?.toUpperCase() ??
        // Backwards compatibility
        element.type?.toUpperCase();

      if (!componentType) {
        return null;
      }

      const component = smartComponentMap?.[componentType];

      if (component) {
        return h(component, element.attrs);
      }
    }

    if (element.tag === "style") {
      return h("style", {
        innerHTML: element.data,
      });
    }

    const nodeChildren = [element.data, ...children].filter(Boolean);

    return h(
      (componentMap?.[element.tag as "div"] as any) || element.tag,
      {
        style: getStyleObjectFromString(element?.style),
        ...element.attrs,
      },
      nodeChildren.length ? nodeChildren : undefined,
    );
  },
});

export default PantheonTreeRenderer;
