import type { ComponentProps } from "react";
import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  Calendar,
  Ellipsis,
  Mail,
  Phone,
  Search,
  User,
} from "lucide-react";

import { Badge } from "../badge";
import { IconButton } from "../button";
import { Row } from "../flex";
import { Input } from "./input";

function ControlledInput(
  props: ComponentProps<typeof Input>
): React.JSX.Element {
  const [value, setValue] = useState(props.value || "");

  return (
    <Input
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onClear={() => setValue("")}
    />
  );
}

const labelIcons = {
  None: undefined,
  Mail: <Mail />,
  Ellipsis: <Ellipsis />,
  Calendar: <Calendar />,
  Search: <Search />,
  User: <User />,
  Phone: <Phone />,
};

const actions = {
  None: undefined,
  ellipsis: (
    <IconButton variant="ghost" size="2xs">
      <Ellipsis />
    </IconButton>
  ),
  badge: <Badge>Recommended</Badge>,
};

const leftIcons = {
  None: undefined,
  User: <User />,
  Search: <Search />,
};

const rightIconButtons = {
  None: undefined,
  Calendar: (
    <IconButton variant="ghost" size="2xs">
      <Calendar />
    </IconButton>
  ),
  Ellipsis: (
    <IconButton variant="ghost" size="2xs">
      <Ellipsis />
    </IconButton>
  ),
};

const meta = {
  title: "Components/Atoms/Input",
  component: Input,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    labelIcon: {
      options: Object.keys(labelIcons),
      mapping: labelIcons,
      control: {
        type: "select",
        labels: {
          None: "None",
          Mail: "Mail",
          Ellipsis: "Ellipsis",
          Calendar: "Calendar",
          Search: "Search",
          User: "User",
          Phone: "Phone",
        },
      },
    },
    leftIcon: {
      options: Object.keys(leftIcons),
      mapping: leftIcons,
      control: {
        type: "select",
        labels: {
          None: "None",
          User: "User",
          Search: "Search",
        },
      },
    },
    rightIconButton: {
      options: Object.keys(rightIconButtons),
      mapping: rightIconButtons,
      control: {
        type: "select",
        labels: {
          None: "None",
          Calendar: "Calendar",
          Ellipsis: "Ellipsis",
        },
      },
    },
    actions: {
      options: Object.keys(actions),
      mapping: actions,
      control: {
        type: "select",
        labels: {
          None: "None",
          ellipsis: "Ellipsis",
          badge: "Badge",
        },
      },
    },
  },
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Row className="w-96">
      <ControlledInput {...args} />
    </Row>
  ),
  args: {
    id: "email",
    label: "Email",
    labelIcon: <Mail />,
    placeholder: "Enter your email",
    required: true,
  },
};

export const WithDescription: Story = {
  render: (args) => (
    <Row className="w-96">
      <ControlledInput {...args} />
    </Row>
  ),
  args: {
    id: "username",
    label: "Username",
    labelIcon: <User />,
    placeholder: "Enter your username",
    description: "This will be your public display name",
    required: true,
  },
};

export const WithError: Story = {
  render: (args) => (
    <Row className="w-96">
      <ControlledInput {...args} />
    </Row>
  ),
  args: {
    id: "email-error",
    label: "Email",
    labelIcon: <Mail />,
    placeholder: "Enter your email",
    value: "invalid@",
    error: "Please enter a valid email address",
    required: true,
  },
};

export const WithLeftIcon: Story = {
  render: (args) => (
    <Row className="w-96">
      <ControlledInput {...args} />
    </Row>
  ),
  args: {
    id: "search",
    label: "Search",
    leftIcon: <Search />,
    placeholder: "Search for anything...",
  },
};

export const WithRightIconButton: Story = {
  render: (args) => (
    <Row className="w-96">
      <ControlledInput {...args} />
    </Row>
  ),
  args: {
    id: "date",
    label: "Schedule date",
    placeholder: "Tomorrow or next week",
    rightIconButton: (
      <IconButton
        variant="ghost"
        size="2xs"
        onClick={() => alert("Open calendar")}
      >
        <Calendar />
      </IconButton>
    ),
  },
};

export const WithAction: Story = {
  render: (args) => (
    <Row className="w-96">
      <ControlledInput {...args} />
    </Row>
  ),
  args: {
    id: "promo-code",
    label: "Promo Code",
    labelIcon: <Mail />,
    placeholder: "Enter code",
    description: "Have a discount code? Enter it here",
    actions: <Badge>Recommended</Badge>,
  },
};
