import { Badge as BaseBadge } from "@pantheon-systems/pds-toolkit-react";
import { type InferSmartComponentProps } from "@pantheon-systems/pcc-sdk-core";

/**
 * A visual label to convey a status
 */
export const reactComponent = ({
  statusType,
  label,
  hasStatusType,
  className,
}: InferSmartComponentProps<typeof smartComponentDefinition>) => {
  return (
    <BaseBadge
      statusType={statusType}
      label={label}
      hasStatusType={hasStatusType}
      className={className}
    />
  );
};

export const smartComponentDefinition = {
  title: "Badge",
  iconUrl: null,
  fields: {
    /**
     * Status type for badge. Only renders if `hasStatusType` is true.
     */
    statusType: {
      displayName: "Status Type",
      type: "enum",
      required: true,
      options: [
        {
          label: "Status",
          value: "status",
        },
        {
          label: "Info",
          value: "info",
        },
        {
          label: "Frozen",
          value: "frozen",
        },
        {
          label: "Critical",
          value: "critical",
        },
        {
          label: "Warning",
          value: "warning",
        },
        {
          label: "Discovery",
          value: "discovery",
        },
        {
          label: "Neutral",
          value: "neutral",
        },
      ],
    },
    /**
     * Text to display in the badge
     */
    label: {
      displayName: "Label",
      type: "string",
      required: true,
    },
    /**
     * Should the badge be associated with a certain status type
     */
    hasStatusType: {
      displayName: "Has status type",
      type: "boolean",
      required: false,
    },
    className: {
      displayName: "Additional CSS classes",
      type: "string",
      required: false,
    },
  },
} as const;
