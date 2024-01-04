import type { Meta, StoryObj } from "@storybook/react";

import { reactComponent as BannerNotification } from "./index";

const meta = {
  title: "Components/Notification/Inline Message",
  component: BannerNotification,
} satisfies Meta<typeof BannerNotification>;

type Story = StoryObj<typeof meta>;

export default meta;

export const Default: Story = {
  args: {
    title: "Inline Message Title",
    type: "info",
  },
};
