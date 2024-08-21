import { ServersideSmartComponentMap } from "@pantheon-systems/pcc-react-sdk/components";

const serverSmartComponentMap: ServersideSmartComponentMap = {
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
};

export { serverSmartComponentMap };
