import { h, Suspense, defineComponent, Component } from "vue-demi";
import ErrorBoundary from "./ErrorBoundary.vue";

export default function withSmartComponentErrorBoundary<T extends Component>(
  Component: T,
) {
  return defineComponent({
    components: {
      ErrorBoundary,
      Component,
    },
    // @ts-expect-error - Props are defined on instance of component, ComponentInstance helper not available in this version of Vue
    props: Component.props, // Bind the child component's props
    render() {
      return h(
        ErrorBoundary,
        {},
        {
          default: () =>
            h(
              Suspense,
              {
                fallback: "Loading...",
              },
              { default: () => h(Component, { ...this.$props }) },
            ),
        },
      );
    },
  });
}
