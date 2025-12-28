import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Stack } from "../flex";
import { Label } from "./label";

const meta = {
  title: "Components/Atoms/Label",
  component: Label,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Label>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Stack className="bg-background w-64 rounded-lg p-4">
      <Label {...args} />
    </Stack>
  ),
  args: {
    children: "Label",
  },
};
