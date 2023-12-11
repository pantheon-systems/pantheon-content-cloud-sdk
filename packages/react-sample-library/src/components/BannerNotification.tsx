import {
  BannerNotificationProps,
  BannerNotification as BaseBannerNotification,
} from "@pantheon-systems/pds-toolkit-react";
import { type SmartComponentMap } from "@pantheon-systems/pcc-sdk-core";

// TODO: Infer the type of the props from the smart component definition
// https://getpantheon.atlassian.net/browse/PCC-827
export default function BannerNotification({
  type,
  message,
}: BannerNotificationProps) {
  return <BaseBannerNotification type={type} message={message} />;
}

BannerNotification.smartComponentDefinition = {
  title: "Banner Notification",
  iconUrl: null,
  fields: {
    type: {
      displayName: "Type",
      type: "enum",
      required: true,
      options: [
        {
          label: "Warning",
          value: "warning",
        },
        {
          label: "Critical",
          value: "critical",
        },
        {
          label: "Info",
          value: "info",
        },
      ],
    },
    message: {
      displayName: "Message",
      type: "string",
      required: true,
    },
  },
} satisfies SmartComponentMap[string];
