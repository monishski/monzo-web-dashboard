import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { getVariantArgTypes } from "@/utils/storybook";

import { Stack } from "../flex";
import { Heading } from "./heading";
import type { HeadingVariantsProps } from "./heading.variants";
import { headingVariants } from "./heading.variants";

const variantArgTypes = getVariantArgTypes<HeadingVariantsProps>({
  variants: headingVariants.variants,
  defaultVariants: headingVariants.defaultVariants,
  descriptions: {
    as: "Heading HTML element",
    weight: "Font weight",
    align: "Text alignment",
    color: "Text color",
    fullWidth: "Expand to full width",
    truncate: "Stop text expanding beyond width of container",
  },
});

const meta = {
  title: "Components/Atoms/Heading",
  component: Heading,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: variantArgTypes,
} satisfies Meta<typeof Heading>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Stack className="bg-background w-64 rounded-lg p-4">
      <Heading {...args} />
    </Stack>
  ),
  args: {
    children: "Heading",
    ...headingVariants.defaultVariants,
    align: "center",
  },
};

export const Levels: Story = {
  render: () => (
    <Stack className="bg-background rounded-lg p-4">
      <Heading as="h1">Heading</Heading>
      <Heading as="h2">Heading</Heading>
      <Heading as="h3">Heading</Heading>
      <Heading as="h4">Heading</Heading>
      <Heading as="h5">Heading</Heading>
      <Heading as="h6">Heading</Heading>
    </Stack>
  ),
};

export const Weights: Story = {
  render: () => (
    <Stack className="bg-background rounded-lg p-4">
      <Heading weight="bold">Bold</Heading>
      <Heading weight="semibold">Semibold</Heading>
    </Stack>
  ),
};

export const Alignment: Story = {
  render: () => (
    <Stack className="bg-background w-64 rounded-lg p-4">
      <Heading align="left">Left</Heading>
      <Heading align="center">Center</Heading>
      <Heading align="right">Right</Heading>
    </Stack>
  ),
};

export const Colors: Story = {
  render: () => (
    <Stack className="bg-background rounded-lg p-4">
      <Heading color="font">Font</Heading>
      <Heading color="muted">Muted</Heading>
      <Heading color="primary">Primary</Heading>
      <Heading color="error">Error</Heading>
      <Heading color="success">Success</Heading>
      <Heading color="warning">Warning</Heading>
      <Heading color="info">Info</Heading>
    </Stack>
  ),
};
