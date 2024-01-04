import type { Meta, StoryObj } from "@storybook/react";

import { reactComponent as IndicatorBadge } from "./index";

const meta = {
  title: "Components/Badges/Indicator Badge",
  component: IndicatorBadge,
} satisfies Meta<typeof IndicatorBadge>;

type Story = StoryObj<typeof meta>;

export default meta;

export const Default: Story = {
  args: {
    variant: "silver",
  },
};
