import { ClientOnly } from "#components";
import { h } from "vue";
import ErrorBoundary from "./ErrorBoundary.vue";
import LeadCapture from "./LeadCapture.vue";

export default function withClientOnlyAndErrorBoundary(Component) {
  // This effectively opts your smart components out of server-side rendering.
  // This is a trade-off you should consider. If you want to opt-in to
  // server-side rendering of the component, disable this error boundary but be
  // aware errors in the component will crash the entire page.
  return defineComponent({
    components: {
      ClientOnly,
      ErrorBoundary,
      Component,
    },
    props: Component.props, // Bind the child component's props
    render() {
      return h(
        ErrorBoundary,
        {},
        {
          default: () =>
            h(
              ClientOnly,
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

// Smart components for article rendering
export const smartComponentMap = {
  LEAD_CAPTURE: withClientOnlyAndErrorBoundary(LeadCapture),
};
