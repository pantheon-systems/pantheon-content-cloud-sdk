import {
  ServersideSmartComponentMap,
  SmartComponentMap,
} from "@pantheon-systems/pcc-react-sdk/components";
import * as Avatar from "./Avatar";
import * as Badge from "./Badge";
import * as BannerNotification from "./BannerNotification";
import * as Blockquote from "./Blockquote";
import * as CTALink from "./CTALink";
import * as InlineBannerNotification from "./InlineBannerNotification";
import * as SectionBannerNotification from "./SectionBannerNotification";
import * as Tooltip from "./Tooltip";

// Adding a PANTHEON_ prefix to help developers using
// this library avoid naming conflicts.
export const ClientSmartComponentMap: SmartComponentMap = {
  PANTHEON_AVATAR: {
    ...Avatar.smartComponentDefinition,
    reactComponent: Avatar.reactComponent,
  },
  PANTHEON_BADGE: {
    ...Badge.smartComponentDefinition,
    reactComponent: Badge.reactComponent,
  },
  PANTHEON_BANNER_NOTIFICATION: {
    ...BannerNotification.smartComponentDefinition,
    reactComponent: BannerNotification.reactComponent,
  },
  PANTHEON_BLOCKQUOTE: {
    ...Blockquote.smartComponentDefinition,
    reactComponent: Blockquote.reactComponent,
  },
  PANTHEON_CTA_LINK: {
    ...CTALink.smartComponentDefinition,
    reactComponent: CTALink.reactComponent,
  },
  PANTHEON_INLINE_BANNER_NOTIFICATION: {
    ...InlineBannerNotification.smartComponentDefinition,
    reactComponent: InlineBannerNotification.reactComponent,
  },
  PANTHEON_SECTION_BANNER_NOTIFICATION: {
    ...SectionBannerNotification.smartComponentDefinition,
    reactComponent: SectionBannerNotification.reactComponent,
  },
  PANTHEON_TOOLTIP: {
    ...Tooltip.smartComponentDefinition,
    reactComponent: Tooltip.reactComponent,
  },
};

// Clone the client-side map and remove reactComponent from each entry.
export const ServerSmartComponentMap: ServersideSmartComponentMap =
  Object.assign({}, ClientSmartComponentMap);

Object.entries(ServerSmartComponentMap).forEach(([k, v]) => {
  ServerSmartComponentMap[k] = Object.assign({}, v);
  delete ServerSmartComponentMap[k].reactComponent;
});

export {
  Avatar,
  Badge,
  BannerNotification,
  Blockquote,
  CTALink,
  InlineBannerNotification,
  SectionBannerNotification,
  Tooltip,
};
