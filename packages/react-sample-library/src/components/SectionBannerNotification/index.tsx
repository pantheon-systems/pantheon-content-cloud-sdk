import { SectionMessage as BaseSectionBannerNotification } from "@pantheon-systems/pds-toolkit-react";
import { type InferSmartComponentProps } from "@pantheon-systems/pcc-sdk-core";

/**
 * In-page messaging
 */
export const reactComponent = ({
  message,
  type,
  isDismissible,
  id,
  title,
  className,
}: InferSmartComponentProps<typeof smartComponentDefinition>) => {
  return (
    <BaseSectionBannerNotification
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
    /**
     * Message type.
     */
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
    /**
     * Message text.
     */
    message: {
      displayName: "Message",
      type: "string",
      required: true,
    },
    /**
     * Includes dismiss functionality.
     */
    isDismissible: {
      displayName: "Is dismissible",
      type: "boolean",
      required: false,
    },
    /**
     * Message id.
     */
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
      displayName: "Additional CSS classes",
      type: "string",
      required: false,
    },
  },
} as const;
