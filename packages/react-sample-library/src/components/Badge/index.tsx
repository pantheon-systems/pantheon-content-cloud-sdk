import { Badge as BaseBadge } from "@pantheon-systems/pds-toolkit-react";
import { type SmartComponentMap } from "@pantheon-systems/pcc-sdk-core";

export interface Props {
  /**
   * Status type for badge. Only renders if `hasStatusType` is true.
   */
  statusType?:
    | "status"
    | "info"
    | "frozen"
    | "critical"
    | "warning"
    | "discovery"
    | "neutral";
  /**
   * Text for badge
   */
  label: string;
  /**
   * Should the badge be associated with a certain status type.
   */
  hasStatusType?: boolean;
}

/**
 * A visual label to convey a status
 */
export const reactComponent = ({ statusType, label, hasStatusType }: Props) => {
  return (
    <BaseBadge
      statusType={statusType}
      label={label}
      hasStatusType={hasStatusType}
    />
  );
};

export const smartComponentDefinition = {
  title: "Badge",
  iconUrl: null,
  fields: {
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
    label: {
      displayName: "Label",
      type: "string",
      required: false,
    },
    hasStatusType: {
      displayName: "Has status type",
      type: "boolean",
      required: false,
    },
  },
} satisfies SmartComponentMap[string];
