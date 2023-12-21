import type { Meta, StoryObj } from "@storybook/react";

import { reactComponent as CTALink } from "./index";

const meta = {
  title: "Components/CTALink",
  component: CTALink,
} satisfies Meta<typeof CTALink>;

type Story = StoryObj<typeof meta>;

export default meta;

export const Default: Story = {
  args: {
    href: "https://www.pantheon.io",
    linkText: "Pantheon",
  },
};
