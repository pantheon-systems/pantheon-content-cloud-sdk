import {
  ServersideSmartComponentMap,
  SmartComponentMap,
} from "@pantheon-systems/pcc-react-sdk/components";
import { withSmartComponentErrorBoundary } from "./error-boundary";
import LeadCapture from "./lead-capture";
import MediaPreview from "./media-preview";

export const serverSmartComponentMap = {
  LEAD_CAPTURE: {
    title: "Lead Capture Form",
    iconUrl: null,
    fields: {
      heading: {
        displayName: "Heading",
        required: true,
        type: "string",
      },
      description: {
        displayName: "Description",
        required: true,
        type: "string",
      },
      inputLabel: {
        displayName: "Input Label",
        required: true,
        type: "string",
      },
      submitButtonText: {
        displayName: "Submit Button Text",
        required: false,
        type: "string",
      },
    },
  },
  MEDIA_PREVIEW: {
    title: "Media Preview",
    iconUrl: null,
    variants: ["standard", "racecar"],
    exampleImageUrl:
      ["https://storage.googleapis.com/pcc-prod-user-uploads/preview-media-preview.png", "https://www.frontsigns.com/wp-content/webp-express/webp-images/doc-root/wp-content/uploads/2022/11/race-car-branding.jpg.webp"],
    fields: {
      url: {
        displayName: "URL",
        required: true,
        type: "string",
      },
    },
  },
} satisfies ServersideSmartComponentMap;

export const clientSmartComponentMap: SmartComponentMap = {
  MEDIA_PREVIEW: {
    ...serverSmartComponentMap.MEDIA_PREVIEW,
    reactComponent: withSmartComponentErrorBoundary(MediaPreview),
  },
  LEAD_CAPTURE: {
    ...serverSmartComponentMap.LEAD_CAPTURE,
    reactComponent: withSmartComponentErrorBoundary(LeadCapture),
  },
};
