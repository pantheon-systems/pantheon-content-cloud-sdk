import type { Meta, StoryObj } from "@storybook/react";

import {reactComponent as SectionBannerNotification} from "./index";

const meta = {
  title: 'Components/Notification/Section Message',
  component: SectionBannerNotification,
} satisfies Meta<typeof SectionBannerNotification>;

type Story = StoryObj<typeof meta>;

export default meta;

export const Default: Story = {
  args: {
    id: 1,
    message: "Section Message",
    type: "info",
  }
}