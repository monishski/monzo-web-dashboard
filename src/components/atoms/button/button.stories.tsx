import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Download, Settings } from "lucide-react";

import { getVariantArgTypes } from "@/utils/storybook";

import { Row } from "../flex";
import { Button } from "./button";
import type { ButtonVariantsProps } from "./button.variants";
import { buttonVariants } from "./button.variants";

const variantArgTypes = getVariantArgTypes<ButtonVariantsProps>({
  variants: {
    ...buttonVariants.extend.variants,
    ...buttonVariants.variants,
    variant: {
      ...buttonVariants.extend.variants.variant,
      ...buttonVariants.variants.variant,
    },
  },
  defaultVariants: buttonVariants.defaultVariants,
  descriptions: {
    variant: "Button variant",
    size: "Button size",
    disabled: "Disable button",
    fullWidth: "Expand to full width",
  },
});

const meta = {
  title: "Components/Atoms/Button/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    asChild: {
      control: { type: "boolean" },
      description: "Merge button props with child component",
      table: {
        defaultValue: { summary: "false" },
        disable: true,
        type: { summary: "boolean" },
      },
    },
    ...variantArgTypes,
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    return (
      <Row className="w-64 p-4">
        <Button {...args} />
      </Row>
    );
  },
  args: {
    children: "Button",
    ...buttonVariants.defaultVariants,
  },
};

export const Variants: Story = {
  render: () => (
    <Row className="p-4">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
      <Button variant="destructive">Destructive</Button>
    </Row>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Row className="p-4">
      <Button disabled variant="primary">
        Primary
      </Button>
      <Button disabled variant="secondary">
        Secondary
      </Button>
      <Button disabled variant="outline">
        Outline
      </Button>
      <Button disabled variant="ghost">
        Ghost
      </Button>
      <Button disabled variant="link">
        Link
      </Button>
      <Button disabled variant="destructive">
        Destructive
      </Button>
    </Row>
  ),
};

export const Sizes: Story = {
  render: () => (
    <Row className="p-4">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </Row>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <Row className="p-4">
      <Button>
        Download
        <Download />
      </Button>
      <Button>
        <Settings />
        Settings
      </Button>
    </Row>
  ),
};
