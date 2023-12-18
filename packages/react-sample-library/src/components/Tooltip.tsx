import {
  Tooltip as BaseTooltip,
  TooltipProps,
} from "@pantheon-systems/pds-toolkit-react";
import { type SmartComponentMap } from "@pantheon-systems/pcc-sdk-core";

// TODO: Infer the type of the props from the smart component definition
// https://getpantheon.atlassian.net/browse/PCC-827
export const reactComponent = ({
  content,
  triggerIcon,
  triggerAccessibleText,
  triggerText,
  className,
}: TooltipProps) => {
  return (
    <BaseTooltip
      content={content}
      triggerIcon={triggerIcon}
      triggerAccessibleText={triggerAccessibleText}
      triggerText={triggerText}
      className={className}
    />
  );
};

export const smartComponentDefinition = {
  title: "Tooltip",
  iconUrl: null,
  fields: {
    triggerIcon: {
      displayName: "Trigger Icon",
      type: "enum",
      required: true,
      options: [
        {
          label: "Circle info",
          value: "circleInfo",
        },
        {
          label: "Circle question",
          value: "circleQuestion",
        },
        {
          label: "Circle exclamation",
          value: "circleExclamation",
        },
      ],
    },
    content: {
      displayName: "Content",
      type: "string",
      required: true,
    },
    triggerText: {
      displayName: "Trigger text",
      type: "string",
      required: false,
    },
    triggerAccessibleText: {
      displayName: "Trigger accessible text",
      type: "string",
      required: false,
    },
    className: {
      displayName: "Classname",
      type: "string",
      required: false,
    },
  },
} satisfies SmartComponentMap[string];
