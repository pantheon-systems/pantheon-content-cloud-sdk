import { CTALink as BaseCTALink } from "@pantheon-systems/pds-toolkit-react";
import { type InferSmartComponentProps } from "@pantheon-systems/pcc-sdk-core";

/**
 * CTA Links are stylized anchor elements that allow the user to navigate to another location.
 */
export const reactComponent = ({
  size,
  className,
  href,
  linkText,
}: InferSmartComponentProps<typeof smartComponentDefinition>) => {
  return (
    <BaseCTALink
      size={size}
      className={className}
      linkContent={<a href={href}>{linkText}</a>}
    />
  );
};

export const smartComponentDefinition = {
  title: "CTA Link",
  iconUrl: null,
  fields: {
    /**
     * Link text
     */
    linkText: {
      displayName: "Link text",
      type: "string",
      required: true,
    },
    /**
     * Link location
     */
    href: {
      displayName: "Link URL",
      type: "string",
      required: true,
    },
    /**
     * Size of the CTA Link
     * @default md
     */
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
    className: {
      displayName: "Additional CSS classes",
      type: "string",
      required: false,
    },
  },
} as const;
