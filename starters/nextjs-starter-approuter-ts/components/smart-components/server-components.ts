import { ServersideSmartComponentMap } from "@pantheon-systems/pcc-react-sdk/components";

const serverSmartComponentMap: ServersideSmartComponentMap = {
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
};

export { serverSmartComponentMap };
