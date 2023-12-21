import { IndicatorBadge as BaseIndicatorBadge } from "@pantheon-systems/pds-toolkit-react";
import { type SmartComponentMap } from "@pantheon-systems/pcc-sdk-core";

export interface Props {
  /**
   * Badge variant
   */
  variant: "silver" | "gold" | "platinum" | "diamond" | "early-access";
  /**
   * Optional custom label, will override the default label for each variant.
   */
  customLabel?: string;
  /**
   * Additional class names
   */
  className?: string;
}

/**
 * A visual label to indicate a special status or category
 */
export const reactComponent = ({ variant, className, customLabel }: Props) => {
  return (
    <BaseIndicatorBadge
      variant={variant}
      className={className}
      customLabel={customLabel}
    />
  );
};

export const smartComponentDefinition = {
  title: "Indicator Badge",
  iconUrl: null,
  fields: {
    variant: {
      displayName: "Variant",
      type: "enum",
      required: true,
      options: [
        {
          label: "Silver",
          value: "silver",
        },
        {
          label: "Gold",
          value: "gold",
        },
        {
          label: "Platinum",
          value: "platinum",
        },
        {
          label: "Diamond",
          value: "diamond",
        },
        {
          label: "Early Access",
          value: "early-access",
        },
      ],
    },
    customLabel: {
      displayName: "Custom Label",
      type: "string",
      required: false,
    },
    className: {
      displayName: "Classname",
      type: "boolean",
      required: false,
    },
  },
} satisfies SmartComponentMap[string];
