import { SmartComponentMap } from "@pantheon-systems/pcc-react-sdk/components";
import LeadCapture from "./lead-capture";
import MediaPreview from "./media-preview";
import InfoCard from "./info-card";
import TileNavigation from "./tile-navigation";
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
  INFO_CARD: {
    ...serverSmartComponentMap.INFO_CARD,
    reactComponent: InfoCard,
  },
  TILE_NAVIGATION: {
    ...serverSmartComponentMap.TILE_NAVIGATION,
    reactComponent: TileNavigation,
  },
};

export { clientSmartComponentMap };
