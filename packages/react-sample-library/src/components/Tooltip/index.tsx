import { Tooltip as BaseTooltip } from "@pantheon-systems/pds-toolkit-react";
import { type SmartComponentMap } from "@pantheon-systems/pcc-sdk-core";

// TODO: Infer the type of the props from the smart component definition
// https://getpantheon.atlassian.net/browse/PCC-827
export interface Props {
  /**
   * Text to display in tooltip
   */
  content: string;
  /**
   * The accessible text for the trigger. Only necessary when the trigger is an icon.
   */
  triggerAccessibleText?: string;
  /**
   * Icon to trigger tooltip
   * @default circleInfo
   */
  triggerIcon?: "circleInfo" | "circleQuestion" | "circleExclamation";
  /**
   * Text to use as the trigger instead of an icon. Leave blank to use the icon.
   */
  triggerText?: string;
  /**
   * Additional class names
   */
  className?: string;
}

/**
 * A brief message to give more context to an elements
 */
export const reactComponent = ({
  content,
  triggerIcon,
  triggerAccessibleText,
  triggerText,
  className,
}: Props) => {
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
      required: false,
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
