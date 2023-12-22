import { Avatar as BaseAvatar } from "@pantheon-systems/pds-toolkit-react";
import { type SmartComponentMap } from "@pantheon-systems/pcc-sdk-core";

// TODO: Infer the type of the props from the smart component definition
// https://getpantheon.atlassian.net/browse/PCC-827
type Props = {
  /**
   * Link to the image to display
   */
  image: string;
  /**
   * Avatar size
   * @default md
   */
  size?: "sm" | "md";
  /**
   * Additional class names
   */
  className?: string;
  /**
   * Which icon to use if image not provided.
   * @default user
   */
  fallbackIcon?: "user" | "users";
};

/**
 * A visual representation of a user or organization
 */
export const reactComponent = ({
  image,
  size,
  className,
  fallbackIcon,
}: Props) => {
  return (
    <BaseAvatar
      imageSrc={image}
      avatarSize={size}
      className={className}
      fallbackIcon={fallbackIcon}
    />
  );
};

export const smartComponentDefinition = {
  title: "Avatar",
  iconUrl: null,
  fields: {
    image: {
      type: "file",
      required: false,
      displayName: "Image",
    },
    size: {
      displayName: "Size",
      type: "enum",
      required: false,
      options: [
        {
          label: "Small",
          value: "sm",
        },
        {
          label: "Medium",
          value: "md",
        },
      ],
    },
    fallbackIcon: {
      displayName: "Fallback Icon",
      type: "enum",
      required: false,
      options: [
        {
          label: "Avatar showing one user",
          value: "user",
        },
        {
          label: "Avatar showing multiple users",
          value: "users",
        },
      ],
    },
  },
} satisfies SmartComponentMap[string];
