import type { Meta, StoryObj } from "@storybook/react";

import { reactComponent as Card } from "./index";

const meta = {
  title: "Components/Cards/Links Card",
  component: Card,
} satisfies Meta<typeof Card>;

type Story = StoryObj<typeof meta>;

export default meta;

export const Default: Story = {
  args: {
    headingText: "Links Card",
    links: [
      {
        linkText: "Link 1",
        href: "https://pantheon.com",
      },
      {
        linkText: "Link 2",
        href: "https://pantheon.com",
      },
      {
        linkText: "Link 3",
        href: "https://pantheon.com",
      },
    ],
  },
};
