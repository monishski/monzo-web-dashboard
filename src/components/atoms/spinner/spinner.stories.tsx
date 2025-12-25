import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { getVariantArgTypes } from "@/utils/storybook";

import { Row } from "../flex";
import { Spinner } from "./spinner";
import type { SpinnerVariantProps } from "./spinner.variants";
import { spinnerVariants } from "./spinner.variants";

const variantArgTypes = getVariantArgTypes<SpinnerVariantProps>({
  variants: spinnerVariants.variants,
  defaultVariants: spinnerVariants.defaultVariants,
  descriptions: {
    size: "Spinner size",
  },
});

const meta = {
  title: "Components/Atoms/Spinner",
  component: Spinner,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    ...variantArgTypes,
  },
} satisfies Meta<typeof Spinner>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    return <Spinner {...args} />;
  },
  args: spinnerVariants.defaultVariants,
};

export const Sizes: Story = {
  render: () => (
    <Row className="gap-4 p-4">
      <Spinner size="xs" />
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" />
      <Spinner size="xl" />
    </Row>
  ),
};
