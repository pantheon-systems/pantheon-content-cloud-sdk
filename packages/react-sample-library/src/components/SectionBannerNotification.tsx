import {
  SectionMessage as BaseSectionMessage,
  SectionMessageProps,
} from "@pantheon-systems/pds-toolkit-react";
import { type SmartComponentMap } from "@pantheon-systems/pcc-sdk-core";

// TODO: Infer the type of the props from the smart component definition
// https://getpantheon.atlassian.net/browse/PCC-827
export const reactComponent = ({
  message,
  type,
  isDismissible,
  id,
  title,
  className,
}: SectionMessageProps) => {
  return (
    <BaseSectionMessage
      message={message}
      type={type}
      isDismissible={isDismissible}
      id={id}
      title={title}
      className={className}
    />
  );
};

export const smartComponentDefinition = {
  title: "Section Banner Notification",
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
          label: "Success",
          value: "success",
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
    message: {
      displayName: "Message",
      type: "string",
      required: true,
    },
    isDismissible: {
      displayName: "Is dismissible",
      type: "boolean",
      required: false,
    },
    id: {
      displayName: "Id",
      type: "number",
      required: true,
    },
    title: {
      displayName: "Title",
      type: "string",
      required: false,
    },
    className: {
      displayName: "Class name",
      type: "string",
      required: false,
    },
  },
} satisfies SmartComponentMap[string];
