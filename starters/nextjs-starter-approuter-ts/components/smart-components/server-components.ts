import { ServersideSmartComponentMap } from "@pantheon-systems/pcc-react-sdk/components";

const serverSmartComponentMap: ServersideSmartComponentMap = {
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
};

export { serverSmartComponentMap };
