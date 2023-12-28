import type { Meta, StoryObj } from "@storybook/react";

import { reactComponent as Card } from "./index";

const meta = {
  title: "Components/Cards/Site Card",
  component: Card,
} satisfies Meta<typeof Card>;

type Story = StoryObj<typeof meta>;

export default meta;

export const Default: Story = {
  args: {
    headingLevel: "h3",
    siteLinkText: "Visit Site",
    siteLinkURL: "https://pantheon.io",
    siteName: "My new site",
    sitePlan: "Sandbox",
    siteStatus: "Active",
    siteImage:
      "https://cdn.bfldr.com/MEM5087K/at/mzp9s3sb7np4kp4sgp8tgb/default-screenshot.jpg?auto=webp&format=png",
  },
};
