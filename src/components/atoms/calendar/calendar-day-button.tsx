"use client";

import type { JSX } from "react";
import { useEffect, useRef } from "react";
import type { DayButtonProps } from "react-day-picker";

import { IconButton } from "../button";
import { calendarVariants } from "./calendar.variants";

export function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}: DayButtonProps): JSX.Element {
  const ref = useRef<HTMLButtonElement>(null);

  const styles = calendarVariants();

  useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);

  return (
    <IconButton
      ref={ref}
      variant="ghost"
      size="xs"
      className={styles.dayButton({ className })}
      data-day={day.date.toLocaleDateString()}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      {...props}
    />
  );
}
