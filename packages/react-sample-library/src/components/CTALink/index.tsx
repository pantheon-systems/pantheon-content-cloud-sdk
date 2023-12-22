import { CTALink as BaseCTALink } from "@pantheon-systems/pds-toolkit-react";
import { type SmartComponentMap } from "@pantheon-systems/pcc-sdk-core";

// TODO: Infer the type of the props from the smart component definition
// https://getpantheon.atlassian.net/browse/PCC-827
interface Props {
  /**
   * Size of the CTA Link
   * @default md
   */
  size?: "sm" | "md";
  /**
   * Additional class names
   */
  className?: string;
  /**
   * Link location
   */
  href: string;
  /**
   * Link text
   */
  linkText: string;
}

/**
 * CTA Links are stylized anchor elements that allow the user to navigate to another location.
 */
export const reactComponent = ({ size, className, href, linkText }: Props) => {
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
    type: {
      displayName: "Size",
      type: "enum",
      required: true,
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
    href: {
      displayName: "Href",
      type: "string",
      required: true,
    },
    linkText: {
      displayName: "Link text",
      type: "string",
      required: true,
    },
    className: {
      displayName: "Classname",
      type: "string",
      required: false,
    },
  },
} satisfies SmartComponentMap[string];
