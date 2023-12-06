import { Avatar as BaseAvatar } from "@pantheon-systems/pds-toolkit-react";
import { SmartComponentMap } from "@pantheon-systems/pcc-sdk-core/types";

import "@pantheon-systems/pds-toolkit-react/_dist/css/pds-core.css";
import "@pantheon-systems/pds-toolkit-react/_dist/css/pds-layouts.css";
import "@pantheon-systems/pds-toolkit-react/_dist/css/pds-components.css";

// TODO: Infer the type of the props from the smart component definition
type Props = {
  image: string;
  size?: "sm" | "md";
  className?: string;
  fallbackIcon?: "user" | "users";
};

export default function Avatar({
  image,
  size,
  className,
  fallbackIcon,
}: Props) {
  return (
    <BaseAvatar
      imageSrc={image}
      avatarSize={size}
      className={className}
      fallbackIcon={fallbackIcon}
    />
  );
}

Avatar.smartComponentDefinition = {
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
