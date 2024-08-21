import MediaPreview from "./media-preview";

export const serverSmartComponentMap = {
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

export const clientSmartComponentMap = {
  MEDIA_PREVIEW: {
    ...serverSmartComponentMap.MEDIA_PREVIEW,
    reactComponent: MediaPreview,
  },
};

