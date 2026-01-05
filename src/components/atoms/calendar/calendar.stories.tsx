"use client";

import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { DateRange } from "react-day-picker";

import { Calendar } from "./calendar";

// TODO: use react-day-pick docs for props
const meta = {
  title: "Components/Atoms/Calendar",
  component: Calendar,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Calendar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: function Render() {
    const [date, setDate] = useState<Date | undefined>(new Date());
    return (
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="border-edge rounded-xl border shadow-sm"
      />
    );
  },
};

export const SingleSelection: Story = {
  render: function Render() {
    const [date, setDate] = useState<Date | undefined>(new Date());
    return (
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="border-edge rounded-xl border shadow-sm"
      />
    );
  },
};

export const RangeSelection: Story = {
  render: function Render() {
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
      from: new Date(2025, 0, 12),
      to: new Date(2025, 0, 20),
    });
    return (
      <Calendar
        mode="range"
        defaultMonth={dateRange?.from}
        selected={dateRange}
        onSelect={setDateRange}
        className="border-edge rounded-xl border shadow-sm"
      />
    );
  },
};

export const MultiMonth: Story = {
  render: function Render() {
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
      from: new Date(2025, 0, 12),
      to: new Date(2025, 1, 15),
    });
    return (
      <Calendar
        mode="range"
        defaultMonth={dateRange?.from}
        selected={dateRange}
        onSelect={setDateRange}
        numberOfMonths={2}
        className="border-edge rounded-xl border shadow-sm"
      />
    );
  },
};

// TODO: update once Select componet has been added
export const WithDropdownNavigation: Story = {
  render: function Render() {
    const [date, setDate] = useState<Date>(new Date());
    return (
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        required
        captionLayout="dropdown"
        className="border-edge rounded-xl border shadow-sm"
      />
    );
  },
};

export const WithWeekNumbers: Story = {
  render: function Render() {
    const [date, setDate] = useState<Date>(new Date());
    return (
      <Calendar
        mode="single"
        selected={date}
        required
        onSelect={setDate}
        showWeekNumber
        className="border-edge rounded-xl border shadow-sm"
      />
    );
  },
};

export const WithDisabledDates: Story = {
  render: function Render() {
    const [date, setDate] = useState<Date>(new Date());
    const today = new Date();
    return (
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        required
        disabled={{ before: today }}
        className="border-edge rounded-xl border shadow-sm"
      />
    );
  },
};
