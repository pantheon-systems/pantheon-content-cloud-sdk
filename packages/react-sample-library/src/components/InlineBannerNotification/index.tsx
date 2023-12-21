import { InlineMessage as BaseInlineBannerNotification } from "@pantheon-systems/pds-toolkit-react";
import { type SmartComponentMap } from "@pantheon-systems/pcc-sdk-core";

export interface Props {
  title: string;
  type: "info" | "warning" | "critical" | "discovery";
  text?: string;
}

/**
 * A message that is displayed inline with other content
 */
export const reactComponent = ({ title, text, type }: Props) => {
  return <BaseInlineBannerNotification title={title} text={text} type={type} />;
};

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
    title: {
      displayName: "Title",
      type: "string",
      required: true,
    },
    text: {
      displayName: "Text",
      type: "string",
      required: false,
    },
  },
} satisfies SmartComponentMap[string];
