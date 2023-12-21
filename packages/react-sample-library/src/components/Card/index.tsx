import { SmartComponentMap } from "@pantheon-systems/pcc-sdk-core/types";
import { Card as BaseCard } from "@pantheon-systems/pds-toolkit-react";

export interface Props {
  /**
   * Heading for card
   */
  headingText: string;
  /**
   * Text for primary link
   */
  primaryLinkText: string;
  /**
   * Url for primary link
   */
  primaryLinkUrl: string;
  /**
   * Heading level for card
   * @default "h2"
   */
  headingLevel?: "h2" | "h3" | "h4" | "span";
  /**
   * Element to render card as
   * @default "div"
   */
  elementToRender?: "div" | "article" | "aside";
  /**
   * Link to image for card
   */
  image?: string;
  /**
   * Alt text for image
   */
  imageAlt?: string;
  /**
   * Card kicker text
   */
  kickerText?: string;
  /**
   * Short description or summary.
   */
  bodyText?: string;
  /**
   * Text for secondary link
   */
  secondaryLinkText?: string;
  /**
   * Url for secondary link
   */
  secondaryLinkUrl?: string;
  /**
   * Additional classnames
   */
  className?: string;
}

/**
 * A container to summarize information with a subsequent call to action
 */
export const reactComponent = ({
  headingText,
  primaryLinkText,
  primaryLinkUrl,
  headingLevel,
  image,
  imageAlt,
  kickerText,
  bodyText,
  secondaryLinkText,
  elementToRender,
  secondaryLinkUrl,
  className,
}: Props) => {
  const primaryLink = {
    text: primaryLinkText,
    url: primaryLinkUrl,
    target: "_self" as const,
  };
  const secondaryLink =
    secondaryLinkText && secondaryLinkUrl
      ? {
          text: secondaryLinkText,
          url: secondaryLinkUrl,
          target: "_self" as const,
        }
      : undefined;
  const imageProp = image
    ? {
        src: image,
        alt: imageAlt ?? "",
      }
    : undefined;

  return (
    <BaseCard
      headingText={headingText}
      headingLevel={headingLevel}
      primaryLink={primaryLink}
      secondaryLink={secondaryLink}
      image={imageProp}
      kickerText={kickerText}
      bodyText={bodyText}
      elementType={elementToRender}
      className={className}
    />
  );
};

export const smartComponentDefinition = {
  title: "Card",
  iconUrl: null,
  fields: {
    headingText: {
      displayName: "Heading Text",
      type: "string",
      required: true,
    },
    primaryLinkText: {
      displayName: "Primary Link Text",
      type: "string",
      required: true,
    },
    primaryLinkUrl: {
      displayName: "Primary Link Url",
      type: "string",
      required: true,
    },
    headingLevel: {
      displayName: "Heading Level",
      type: "enum",
      required: false,
      options: [
        {
          label: "h2",
          value: "h2",
        },
        {
          label: "h3",
          value: "h3",
        },
        {
          label: "h4",
          value: "h4",
        },
        {
          label: "span",
          value: "span",
        },
      ],
    },
    image: {
      displayName: "Image",
      type: "file",
      required: false,
    },
    imageAlt: {
      displayName: "Image Alt",
      type: "string",
      required: false,
    },
    kickerText: {
      displayName: "Kicker Text",
      type: "string",
      required: false,
    },
    bodyText: {
      displayName: "Body Text",
      type: "string",
      required: false,
    },
    secondaryLinkText: {
      displayName: "Secondary Link Text",
      type: "string",
      required: false,
    },
    secondaryLinkUrl: {
      displayName: "Secondary Link Url",
      type: "string",
      required: false,
    },
    className: {
      displayName: "Classname",
      type: "string",
      required: false,
    },
  },
} satisfies SmartComponentMap[string];
