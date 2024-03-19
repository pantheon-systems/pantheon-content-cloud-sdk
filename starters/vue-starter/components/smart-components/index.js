import LeadCapture from "./LeadCapture.vue";

// Smart components for article rendering
export const smartComponentMap = {
  LEAD_CAPTURE: withClientOnlyAndErrorBoundary(LeadCapture),
};
