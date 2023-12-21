import type { Meta, StoryObj } from "@storybook/react";

import {reactComponent as Tooltip} from "./index";

const meta = {
  title: 'Components/Tooltip',
  component: Tooltip,
} satisfies Meta<typeof Tooltip>;

type Story = StoryObj<typeof meta>;

export default meta;

export const Default: Story = {
  args: {
    content: "Tooltips shouldn’t consist of more than five lines of content."
  }
}