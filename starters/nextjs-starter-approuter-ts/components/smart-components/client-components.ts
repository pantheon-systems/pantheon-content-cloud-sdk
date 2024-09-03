import { SmartComponentMap } from "@pantheon-systems/pcc-react-sdk/components";
import LeadCapture from "./lead-capture";
import MediaPreview from "./media-preview";
import { serverSmartComponentMap } from "./server-components";

const clientSmartComponentMap: SmartComponentMap = {
  LEAD_CAPTURE: {
    ...serverSmartComponentMap.LEAD_CAPTURE,
    reactComponent: LeadCapture,
  },
  MEDIA_PREVIEW: {
    ...serverSmartComponentMap.MEDIA_PREVIEW,
    reactComponent: MediaPreview,
  },
};

export { clientSmartComponentMap };
