import { SmartComponentMap } from "@pantheon-systems/pcc-react-sdk/components";
import { serverSmartComponentMap } from "./server-components";
import MediaPreview from "./media-preview";

const clientSmartComponentMap: SmartComponentMap = {
  MEDIA_PREVIEW: {
    ...serverSmartComponentMap.MEDIA_PREVIEW,
    reactComponent: MediaPreview,
  },
};

export { clientSmartComponentMap };
