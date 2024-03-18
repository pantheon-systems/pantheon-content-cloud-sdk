import {
  ServersideSmartComponentMap,
  SmartComponentMap,
} from "@pantheon-systems/pcc-react-sdk/components";
import LeadCapture from "./lead-capture";

export const serverSmartComponentMap = {
  LEAD_CAPTURE: {
    title: "Lead Capture Form",
    iconUrl: null,
    fields: {
      title: {
        displayName: "Title",
        required: true,
        type: "string",
      },
      body: {
        displayName: "Body",
        required: false,
        type: "string",
      },
    },
  },
} satisfies ServersideSmartComponentMap;

export const clientSmartComponentMap: SmartComponentMap = {
  LEAD_CAPTURE: {
    ...serverSmartComponentMap.LEAD_CAPTURE,
    reactComponent: LeadCapture as any,
  },
};
