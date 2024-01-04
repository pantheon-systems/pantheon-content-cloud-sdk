import type { Meta, StoryObj } from "@storybook/react";

import { reactComponent as Badge } from "./index";

const meta = {
  title: "Components/Badges/Badge",
  component: Badge,
} satisfies Meta<typeof Badge>;

type Story = StoryObj<typeof meta>;

export default meta;

export const Default: Story = {
  args: {
    label: "Info",
    statusType: "info",
  },
};
