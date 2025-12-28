import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  BadgeCheck,
  Check,
  ExternalLink,
  Info,
  TriangleAlert,
  X,
} from "lucide-react";

import { getVariantArgTypes } from "@/utils/storybook";

import { Row } from "../flex";
import { Badge } from "./badge";
import type { BadgeVariantProps } from "./badge.variants";
import { badgeVariants } from "./badge.variants";

const variantArgTypes = getVariantArgTypes<BadgeVariantProps>({
  variants: badgeVariants.variants,
  defaultVariants: badgeVariants.defaultVariants,
  descriptions: {
    variant: "Badge variant",
  },
});

const meta = {
  title: "Components/Atoms/Badge",
  component: Badge,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    asChild: {
      control: { type: "boolean" },
      description: "Merge badge props with child component",
      table: {
        defaultValue: { summary: "false" },
        disable: true,
        type: { summary: "boolean" },
      },
    },
    ...variantArgTypes,
  },
} satisfies Meta<typeof Badge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    return (
      <Badge {...args}>
        <BadgeCheck />
        Badge
      </Badge>
    );
  },
  args: badgeVariants.defaultVariants,
};

export const Variants: Story = {
  render: () => (
    <Row className="flex-wrap gap-2 p-4">
      <Badge variant="primary">Primary</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="info">Info</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="error">Error</Badge>
    </Row>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <Row className="flex-wrap gap-2 p-4">
      <Badge variant="success">
        <Check />
        Success
      </Badge>
      <Badge variant="error">
        <X />
        Error
      </Badge>
      <Badge variant="warning">
        <TriangleAlert />
        Warning
      </Badge>
      <Badge variant="info">
        <Info />
        Info
      </Badge>
    </Row>
  ),
};

export const AsLink: Story = {
  render: () => (
    <Row className="flex-wrap gap-2 p-4">
      <Badge variant="primary" asChild>
        <a href="#">
          Link <ExternalLink />
        </a>
      </Badge>
      <Badge variant="secondary" asChild>
        <a href="#">
          Link <ExternalLink />
        </a>
      </Badge>
      <Badge variant="outline" asChild>
        <a href="#">
          Link <ExternalLink />
        </a>
      </Badge>
      <Badge variant="info" asChild>
        <a href="#">
          Link <ExternalLink />
        </a>
      </Badge>
      <Badge variant="success" asChild>
        <a href="#">
          Link <ExternalLink />
        </a>
      </Badge>
      <Badge variant="warning" asChild>
        <a href="#">
          Link <ExternalLink />
        </a>
      </Badge>
      <Badge variant="error" asChild>
        <a href="#">
          Link <ExternalLink />
        </a>
      </Badge>
      <Badge variant="link" asChild>
        <a href="#">
          Link <ExternalLink />
        </a>
      </Badge>
    </Row>
  ),
};
