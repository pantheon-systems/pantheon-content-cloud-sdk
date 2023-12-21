declare module "*.css";

declare module "@pantheon-systems/pds-toolkit-react" {
  declare interface AvatarProps {
    imageSrc: string;
    avatarSize?: "sm" | "md";
    className?: string;
    fallbackIcon?: "user" | "users";
  }

  declare interface BadgeProps {
    successType:
      | "status"
      | "info"
      | "frozen"
      | "critical"
      | "warning"
      | "discovery"
      | "neutral";
    label: string;
    hasStatusType: boolean;
  }

  declare interface BannerProps {
    type: "warning" | "critical" | "info";
    message: string;
  }

  declare interface BlockquoteProps {
    type: "full-width" | "inline";
    quote: string;
    person: string;
    source: string;
    className: string;
  }

  declare interface CTALinkProps {
    size: "sm" | "md";
    className: string;
    linkContent: React.ReactElement;
  }

  declare interface InlineMessageProps {
    title: string;
    text: string;
    type: "info" | "warning" | "critical" | "discovery";
  }

  declare interface SectionMessageProps {
    message: string;
    type: "info" | "success" | "warning" | "critical" | "discovery";
    isDismissible: boolean;
    id: string;
    title: string;
    className: string;
  }

  declare interface TooltipProps {
    content: string;
    triggerAccessibleText: string;
    triggerIcon: "circleInfo" | "circleQuestion" | "circleExclamation";
    triggerText: string;
    className: string;
  }

  declare const Avatar: import("react").FC<AvatarProps>;
  declare const Badge: import("react").FC<BadgeProps>;
  declare const Banner: import("react").FC<BannerProps>;
  declare const Blockquote: import("react").FC<BlockquoteProps>;
  declare const CTALink: import("react").FC<CTALinkProps>;
  declare const InlineMessage: import("react").FC<InlineMessageProps>;
  declare const SectionMessage: import("react").FC<SectionMessageProps>;
  declare const Tooltip: import("react").FC<TooltipProps>;
}
