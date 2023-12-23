import type { Meta, StoryObj } from "@storybook/react";

import { reactComponent as Card } from "./index";

const meta = {
  title: "Components/Cards/Card",
  component: Card,
} satisfies Meta<typeof Card>;

type Story = StoryObj<typeof meta>;

export default meta;

export const Default: Story = {
  args: {
    headingText: "Card heading goes here",
    kickerText: "Kicker text goes here",
    bodyText:
      "This is the card text. Summarize what the user will see if they click the primary or secondary link.",
    primaryLinkText: "Primary",
    primaryLinkUrl: "https://www.pantheon.io",
    secondaryLinkText: "Secondary",
    secondaryLinkUrl: "https://www.pantheon.io",
    image:
      "https://cdn.bfldr.com/MEM5087K/at/bjqfgbrcsxkswr42rp3m48s/placeimg_360_240_tech.jpeg?auto=webp&format=png",
  },
};
