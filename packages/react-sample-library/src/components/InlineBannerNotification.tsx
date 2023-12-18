import {
  InlineBannerNotification as BaseInlineBannerNotification,
  InlineBannerNotificationProps,
} from "@pantheon-systems/pds-toolkit-react";
import { type SmartComponentMap } from "@pantheon-systems/pcc-sdk-core";

// TODO: Infer the type of the props from the smart component definition
// https://getpantheon.atlassian.net/browse/PCC-827
export const reactComponent = ({
  title,
  text,
  type,
}: InlineBannerNotificationProps) => {
  return <BaseInlineBannerNotification title={title} text={text} type={type} />;
}

export const smartComponentDefinition = {
  title: "Inline Banner Notification",
  iconUrl: null,
  fields: {
    type: {
      displayName: "Type",
      type: "enum",
      required: true,
      options: [
        {
          label: "Info",
          value: "info",
        },
        {
          label: "Warning",
          value: "warning",
        },
        {
          label: "Critical",
          value: "critical",
        },
        {
          label: "Discovery",
          value: "discovery",
        },
      ],
    },
    text: {
      displayName: "Text",
      type: "string",
      required: false,
    },
    title: {
      displayName: "Title",
      type: "string",
      required: false,
    },
  },
} satisfies SmartComponentMap[string];
