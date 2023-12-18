import {
  Badge as BaseBadge,
  BadgeProps,
} from "@pantheon-systems/pds-toolkit-react";
import { type SmartComponentMap } from "@pantheon-systems/pcc-sdk-core";

// TODO: Infer the type of the props from the smart component definition
// https://getpantheon.atlassian.net/browse/PCC-827
export const reactComponent = ({
  successType,
  label,
  hasStatusType,
}: BadgeProps) => {
  return (
    <BaseBadge
      successType={successType}
      label={label}
      hasStatusType={hasStatusType}
    />
  );
}

export const smartComponentDefinition = {
  title: "Badge",
  iconUrl: null,
  fields: {
    successType: {
      displayName: "Success Type",
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
