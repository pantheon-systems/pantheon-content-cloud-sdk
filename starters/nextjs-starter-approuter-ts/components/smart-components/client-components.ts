import { SmartComponentMap } from "@pantheon-systems/pcc-react-sdk/components";
import MediaPreview from "./media-preview";
import { serverSmartComponentMap } from "./server-components";

const clientSmartComponentMap: SmartComponentMap = {
  MEDIA_PREVIEW: {
    ...serverSmartComponentMap.MEDIA_PREVIEW,
    reactComponent: MediaPreview,
  },
};

export { clientSmartComponentMap };
