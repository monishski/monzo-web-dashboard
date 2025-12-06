import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { getVariantArgTypes } from "@/utils/storybook";

import { Stack } from "../flex";
import { Text } from "./text";
import type { TextVariantsProps } from "./text.variants";
import { textVariants } from "./text.variants";

const variantArgTypes = getVariantArgTypes<TextVariantsProps>({
  variants: textVariants.variants,
  defaultVariants: textVariants.defaultVariants,
  descriptions: {
    size: "Font size",
    weight: "Font weight",
    align: "Text alignment",
    color: "Text color",
    fullWidth: "Expand to full width",
  },
});

const meta = {
  title: "Components/Atoms/Text",
  component: Text,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    as: {
      control: "select",
      description: "HTML Element",
      options: ["p", "span"],
      table: {
        defaultValue: { summary: "span" },
        type: { summary: "p | span" },
      },
    },
    ...variantArgTypes,
  },
} satisfies Meta<typeof Text>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Stack className="w-64">
      <Text {...args} />
    </Stack>
  ),
  args: {
    children: "Text",
    as: "span",
    size: "base",
    weight: "normal",
    align: "center",
    color: "font",
    fullWidth: true,
  },
};

export const Sizes: Story = {
  render: () => (
    <Stack>
      <Text size="lg">Large</Text>
      <Text size="base">Base</Text>
      <Text size="sm">Small</Text>
    </Stack>
  ),
};

export const Weights: Story = {
  render: () => (
    <Stack>
      <Text weight="semibold">Semibold</Text>
      <Text weight="medium">Medium</Text>
      <Text weight="normal">Normal</Text>
    </Stack>
  ),
};

export const Alignment: Story = {
  render: () => (
    <Stack className="w-64">
      <Text align="left">Left</Text>
      <Text align="center">Center</Text>
      <Text align="right">Right</Text>
    </Stack>
  ),
};

export const Colors: Story = {
  render: () => (
    <Stack>
      <Text color="font">Font</Text>
      <Text color="muted">Muted</Text>
      <Text color="primary">Primary</Text>
      <Text color="error">Error</Text>
      <Text color="success">Success</Text>
      <Text color="warning">Warning</Text>
      <Text color="info">Info</Text>
    </Stack>
  ),
};
