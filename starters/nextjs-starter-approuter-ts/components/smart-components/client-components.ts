import { SmartComponentMap } from "@pantheon-systems/pcc-react-sdk/components";
import LeadCapture from "./lead-capture";
import { serverSmartComponentMap } from "./server-components";

const clientSmartComponentMap: SmartComponentMap = {
  LEAD_CAPTURE: {
    ...serverSmartComponentMap.LEAD_CAPTURE,
    reactComponent: LeadCapture,
  },
};

export { clientSmartComponentMap };
