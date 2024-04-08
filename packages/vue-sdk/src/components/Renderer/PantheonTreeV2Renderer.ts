import { PantheonTreeNode } from "@pantheon-systems/pcc-sdk-core/types";
import { defineComponent, h, PropType } from "vue-demi";
import { getStyleObjectFromString } from "../../utils/renderer";
import { ComponentMap, SmartComponentMap, ExperimentalFlags } from "./index";
import withSmartComponentErrorBoundary from "../Common/ErrorBoundaries/SmartComponents";

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
    __experimentalFlags: {
      type: Object as PropType<ExperimentalFlags>,
      required: false,
    },
  },
  render() {
    const { element, smartComponentMap, componentMap, __experimentalFlags } =
      this.$props;

    const children =
      element.children?.map((el) =>
        h(PantheonTreeRenderer, {
          element: el,
          smartComponentMap,
          componentMap,
          __experimentalFlags,
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
        return __experimentalFlags?.disableDefaultErrorBoundaries === true
          ? h(component, element.attrs)
          : h(withSmartComponentErrorBoundary(component), element.attrs);
      }
    }

    if (element.tag === "style") {
      if (__experimentalFlags?.disableAllStyles === true) return null;

      return h("style", {
        innerHTML: element.data,
      });
    }

    const nodeChildren = [element.data, ...children].filter(Boolean);

    if (__experimentalFlags?.disableAllStyles === true) {
      element.style = null;
      delete element.attrs?.class;
    }

    return h(
      componentMap?.[element.tag as "div"] || element.tag,
      {
        style: getStyleObjectFromString(element?.style),
        ...element.attrs,
      },
      nodeChildren.length ? nodeChildren : undefined,
    );
  },
});

export default PantheonTreeRenderer;
