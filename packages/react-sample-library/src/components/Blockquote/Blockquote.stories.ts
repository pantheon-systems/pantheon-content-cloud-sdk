import type { Meta, StoryObj } from "@storybook/react";

import { reactComponent as Blockquote } from "./index";

const meta = {
  title: "Components/Blockquote",
  component: Blockquote,
} satisfies Meta<typeof Blockquote>;

type Story = StoryObj<typeof meta>;

export default meta;

export const Default: Story = {
  args: {
    quote:
      "At a fast-growing company like ours, marketing needs to iterate rapidly to deliver leads at scale… Pantheon is the only way we can do that.",
    person: "Eric Peterson",
    source: "Marketing Systems Engineering, Tableau",
  },
};
