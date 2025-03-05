import { withSmartComponentErrorBoundary } from "./error-boundary";
import LeadCapture from "./lead-capture";
import MediaPreview from "./media-preview";
import InfoCard from "./info-card";
import TileNavigation from "./tile-navigation";

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
    exampleImageUrl:
      "https://storage.googleapis.com/pcc-prod-user-uploads/preview-media-preview.png",
    fields: {
      url: {
        displayName: "URL",
        required: true,
        type: "string",
      },
    },
  },
  INFO_CARD: {
    title: "Info Card",
    iconUrl: null,
    fields: {
      title: {
        displayName: "Title",
        required: true,
        type: "string",
      },
      body: {
        displayName: "Body Text",
        required: true,
        type: "string",
      },
      icon: {
        displayName: "Icon",
        required: false,
        type: "enum",
        options: ["info", "warning", "success", "error", "tip"],
        defaultValue: "info",
      },
      theme: {
        displayName: "Theme",
        required: false,
        type: "enum",
        options: ["primary", "secondary", "info", "warning"],
        defaultValue: "primary",
      },
    },
  },
  TILE_NAVIGATION: {
    title: "Tile Navigation",
    iconUrl: null,
    fields: {
      documentIds: {
        displayName: "Document Links or IDs",
        required: true,
        type: "string",
        multiple: true,
      },
    },
  },
};

export const clientSmartComponentMap = {
  MEDIA_PREVIEW: {
    ...serverSmartComponentMap.MEDIA_PREVIEW,
    reactComponent: withSmartComponentErrorBoundary(MediaPreview),
  },
  LEAD_CAPTURE: {
    ...serverSmartComponentMap.LEAD_CAPTURE,
    reactComponent: withSmartComponentErrorBoundary(LeadCapture),
  },
  INFO_CARD: {
    ...serverSmartComponentMap.INFO_CARD,
    reactComponent: withSmartComponentErrorBoundary(InfoCard),
  },
  TILE_NAVIGATION: {
    ...serverSmartComponentMap.TILE_NAVIGATION,
    reactComponent: withSmartComponentErrorBoundary(TileNavigation),
  },
};
