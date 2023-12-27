declare module "*.css";
interface AvatarProps {
  imageSrc?: string;
  avatarSize?: "sm" | "md";
  className?: string;
  fallbackIcon?: "user" | "users";
}

interface BadgeProps {
  label: string;
  statusType?:
    | "status"
    | "info"
    | "frozen"
    | "critical"
    | "warning"
    | "discovery"
    | "neutral";
  hasStatusType?: boolean;
  className?: string;
}
interface CTALinkProps {
  size?: "sm" | "md";
  className?: string;
  linkContent: React.ReactElement;
}

interface BannerProps {
  type: "warning" | "critical" | "info";
  message: string;
  className?: string;
}

interface BlockquoteProps {
  type?: "full-width" | "inline";
  quote: string;
  person: string;
  source: string;
  className?: string;
}

interface InlineBannerNotificationProps {
  title: string;
  type: "info" | "warning" | "critical" | "discovery";
  text?: string;
  className?: string;
}

interface TooltipProps {
  content: string;
  triggerAccessibleText?: string;
  triggerIcon?: "circleInfo" | "circleQuestion" | "circleExclamation";
  triggerText?: string;
  className?: string;
}

interface SectionBannerNotificationProps {
  message: string;
  type: "info" | "success" | "warning" | "critical" | "discovery";
  isDismissible?: boolean;
  id: number;
  title?: string;
  className?: string;
}

interface CardProps {
  bodyText?: string;
  elementType?: "div" | "article" | "aside";
  headingLevel?: "h2" | "h3" | "h4" | "span";
  headingText: string;
  image?: {
    src?: string;
    alt?: string;
  };
  kickerText?: string;
  primaryLink: {
    text: string;
    url: string;
    target?: "_self" | "_blank";
  };
  secondaryLink?: {
    text?: string;
    url?: string;
    target?: "_self" | "_blank";
  };
  className?: string;
}

interface SelectionCardProps {
  badge?: "early-access";
  icon?:
    | "drupal"
    | "wordpress"
    | "gatsby"
    | "next"
    | "import-custom"
    | "drupal-next"
    | "wp-gatsby"
    | "wp-next";
  selectionLink: React.ReactNode;
  subtitle?: string;
  summary?: string;
  supplementalLinks?: React.ReactNode[];
  title: string;
  className?: string;
}

interface IndicatorBadgeProps {
  variant: "silver" | "gold" | "platinum" | "diamond" | "early-access";
  customLabel?: string;
  className?: string;
}

declare module "@pantheon-systems/pds-toolkit-react" {
  declare const Avatar: import("react").FC<AvatarProps>;
  declare const CTALink: import("react").FC<CTALinkProps>;
  declare const Badge: import("react").FC<BadgeProps>;
  declare const Card: import("react").FC<CardProps>;
  declare const SelectionCard: import("react").FC<SelectionCardProps>;
  declare const IndicatorBadge: import("react").FC<IndicatorBadgeProps>;
  declare const Banner: import("react").FC<BannerProps>;
  declare const Blockquote: import("react").FC<BlockquoteProps>;
  declare const InlineMessage: import("react").FC<InlineBannerNotificationProps>;
  declare const SectionMessage: import("react").FC<SectionBannerNotificationProps>;
  declare const Tooltip: import("react").FC<TooltipProps>;
}
