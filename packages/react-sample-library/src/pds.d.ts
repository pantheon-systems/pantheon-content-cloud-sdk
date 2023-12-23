declare module "*.css";
declare interface AvatarProps {
  imageSrc: string;
  avatarSize?: "sm" | "md";
  className?: string;
  fallbackIcon?: "user" | "users";
}

declare interface CTALinkProps {
  size?: "sm" | "md";
  className?: string;
  linkContent: React.ReactElement;
}

// Reuse prop definitions when they are the same
// as the base component's props
type BadgeProps = import("./components/Badge").Props;
type BannerProps = import("./components/BannerNotification").Props;
type BlockquoteProps = import("./components/Blockquote").Props;
type InlineBannerNotificationProps =
  import("./components/InlineBannerNotification").Props;
type SectionBannerNotificationProps =
  import("./components/SectionBannerNotification").Props;
type TooltipProps = import("./components/Tooltip").Props;

declare module "@pantheon-systems/pds-toolkit-react" {
  declare const Avatar: import("react").FC<AvatarProps>;
  declare const CTALink: import("react").FC<CTALinkProps>;
  declare const Badge: import("react").FC<BadgeProps>;
  declare const Banner: import("react").FC<BannerProps>;
  declare const Blockquote: import("react").FC<BlockquoteProps>;
  declare const InlineMessage: import("react").FC<InlineBannerNotificationProps>;
  declare const SectionMessage: import("react").FC<SectionBannerNotificationProps>;
  declare const Tooltip: import("react").FC<TooltipProps>;
}
