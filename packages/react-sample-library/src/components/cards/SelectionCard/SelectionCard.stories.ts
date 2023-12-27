import type { Meta, StoryObj } from "@storybook/react";

import { reactComponent as Card } from "./index";

const meta = {
  title: "Components/Cards/Selection Card",
  component: Card,
} satisfies Meta<typeof Card>;

type Story = StoryObj<typeof meta>;

export default meta;

export const Default: Story = {
  args: {
    title: "Import Repository",
    selectionLinkText: "Import",
    selectionLinkURL: "https://pantheon.io",
    summary: "Import your site from a Git repository.",
    icon: "import-custom",
  },
};
