import { TreePantheonContent } from "@pantheon-systems/pcc-sdk-core/types";
import {
  DefineComponent,
  defineComponent,
  h,
  PropType,
  resolveComponent,
} from "vue-demi";
import { getStyleObjectFromString } from "../../utils/renderer";

export type SmartComponentMap = {
  // Can't know prop types of component, so we use any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: InstanceType<DefineComponent<any, any, any>>;
};

const PantheonTreeRenderer = defineComponent({
  name: "PantheonTreeRenderer",
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

    const children = element.children?.map((el) =>
      h(resolveComponent("PantheonTreeRenderer"), {
        element: el,
        smartComponentMap,
      }),
    );

    if (element.tag === "component") {
      const componentType =
        (element.attrs?.type as string | undefined)?.toUpperCase() ??
        // Backwards compatibility
        element.type?.toUpperCase();
      const component = smartComponentMap?.[componentType];

      if (component) {
        return h(component, element.attrs);
      }
    }

    return h(
      element.tag,
      {
        style: getStyleObjectFromString(element?.style),
        ...element.attrs,
      },
      [element.data, children],
    );
  },
});

export default PantheonTreeRenderer;
