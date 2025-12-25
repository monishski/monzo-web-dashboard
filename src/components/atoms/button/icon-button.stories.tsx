import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Heart } from "lucide-react";

import { getVariantArgTypes } from "@/utils/storybook";

import { Row } from "../flex";
import { IconButton } from "./icon-button";
import type { IconButtonVariantsProps } from "./icon-button.variants";
import { iconButtonVariants } from "./icon-button.variants";

const variantArgTypes = getVariantArgTypes<IconButtonVariantsProps>({
  variants: {
    ...iconButtonVariants.extend.variants,
    ...iconButtonVariants.variants,
  },
  defaultVariants: iconButtonVariants.defaultVariants,
  descriptions: {
    variant: "Icon button variant",
    size: "Icon button size",
    disabled: "Disable icon button",
  },
});

const meta = {
  title: "Components/Atoms/Button/IconButton",
  component: IconButton,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    asChild: {
      control: { type: "boolean" },
      description: "Merge icon button props with child component",
      table: {
        defaultValue: { summary: "false" },
        disable: true,
        type: { summary: "boolean" },
      },
    },
    ...variantArgTypes,
  },
} satisfies Meta<typeof IconButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    return (
      <Row className="w-64 p-4">
        <IconButton {...args} />
      </Row>
    );
  },
  args: {
    children: <Heart />,
    ...iconButtonVariants.defaultVariants,
  },
};

export const Variants: Story = {
  render: () => (
    <Row className="p-4">
      <IconButton variant="primary">
        <Heart />
      </IconButton>
      <IconButton variant="secondary">
        <Heart />
      </IconButton>
      <IconButton variant="outline">
        <Heart />
      </IconButton>
      <IconButton variant="ghost">
        <Heart />
      </IconButton>
      <IconButton variant="destructive">
        <Heart />
      </IconButton>
    </Row>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Row className="p-4">
      <IconButton disabled variant="primary">
        <Heart />
      </IconButton>
      <IconButton disabled variant="secondary">
        <Heart />
      </IconButton>
      <IconButton disabled variant="outline">
        <Heart />
      </IconButton>
      <IconButton disabled variant="ghost">
        <Heart />
      </IconButton>
      <IconButton disabled variant="destructive">
        <Heart />
      </IconButton>
    </Row>
  ),
};

export const Sizes: Story = {
  render: () => (
    <Row className="p-4">
      <IconButton size="2xs">
        <Heart />
      </IconButton>
      <IconButton size="xs">
        <Heart />
      </IconButton>
      <IconButton size="sm">
        <Heart />
      </IconButton>
      <IconButton size="md">
        <Heart />
      </IconButton>
      <IconButton size="lg">
        <Heart />
      </IconButton>
    </Row>
  ),
};
