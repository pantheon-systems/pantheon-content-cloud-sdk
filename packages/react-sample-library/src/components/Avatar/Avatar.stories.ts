import type { Meta, StoryObj } from "@storybook/react";

import { reactComponent as Avatar } from "./index";

const meta = {
  title: "Components/Avatar",
  component: Avatar,
} satisfies Meta<typeof Avatar>;

type Story = StoryObj<typeof meta>;

export default meta;

export const Default: Story = {
  args: {
    image:
      "https://cdn.bfldr.com/MEM5087K/at/ff4pq2jhft94x7fsxc9kkx/devin.jpg?auto=webp&format=png&width=100&height=100",
  },
};
