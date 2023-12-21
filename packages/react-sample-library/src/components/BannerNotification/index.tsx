import { Banner as BaseBannerNotification } from "@pantheon-systems/pds-toolkit-react";
import { type SmartComponentMap } from "@pantheon-systems/pcc-sdk-core";

export interface Props {
  /**
   * Banner style and Icon types
   */
  type: "warning" | "critical" | "info";
  /**
   * Banner message
   */
  message: string;
}

export const reactComponent = ({ type, message }: Props) => {
  return <BaseBannerNotification type={type} message={message} />;
};

/**
 * A prominent user message displayed at the top of the page
 */
export const smartComponentDefinition = {
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
