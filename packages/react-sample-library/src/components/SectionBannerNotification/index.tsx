import { SectionMessage as BaseSectionBannerNotification } from "@pantheon-systems/pds-toolkit-react";
import { type SmartComponentMap } from "@pantheon-systems/pcc-sdk-core";

export interface Props {
  /**
   * Message text.
   */
  message: string;
  /**
   * Message type.
   */
  type: "info" | "success" | "warning" | "critical" | "discovery";
  /**
   * Includes dismiss functionality.
   */
  isDismissible?: boolean;
  id: number;
  title?: string;
  className?: string;
}

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
}: Props) => {
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
