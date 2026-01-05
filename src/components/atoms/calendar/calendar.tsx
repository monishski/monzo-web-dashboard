"use client";

import type { ComponentProps, JSX } from "react";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
import { DayPicker, getDefaultClassNames } from "react-day-picker";

import { IconButton } from "../button";
import { CalendarDayButton } from "./calendar-day-button";
import {
  calendarVariants,
  type CalendarVariantsProps,
} from "./calendar.variants";

export type CalendarProps = ComponentProps<typeof DayPicker> &
  CalendarVariantsProps;

export function Calendar({
  className,
  classNames,
  showOutsideDays = false,
  weekStartsOn = 1,
  captionLayout = "label",
  formatters,
  components,
  ...props
}: CalendarProps): JSX.Element {
  const styles = calendarVariants({
    showWeekNumber: props.showWeekNumber,
    captionLayoutDropdown: captionLayout !== "label",
  });

  const defaultClassNames = getDefaultClassNames();

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      weekStartsOn={weekStartsOn}
      className={styles.root({ className })}
      captionLayout={captionLayout}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString("default", { month: "short" }),
        ...formatters,
      }}
      classNames={{
        months: styles.months({ className: defaultClassNames.months }),
        month: styles.month({ className: defaultClassNames.month }),
        nav: styles.nav({ className: defaultClassNames.nav }),
        button_previous: styles.buttonPrevious({
          className: defaultClassNames.button_previous,
        }),
        button_next: styles.buttonNext({
          className: defaultClassNames.button_next,
        }),
        month_caption: styles.monthCaption({
          className: defaultClassNames.month_caption,
        }),
        dropdowns: styles.dropdowns({
          className: defaultClassNames.dropdowns,
        }),
        dropdown_root: styles.dropdownRoot({
          className: defaultClassNames.dropdown_root,
        }),
        dropdown: styles.dropdown({
          className: defaultClassNames.dropdown,
        }),
        caption_label: styles.captionLabel({
          className: defaultClassNames.caption_label,
        }),
        table: styles.table(),
        weekdays: styles.weekdays({
          className: defaultClassNames.weekdays,
        }),
        weekday: styles.weekday({ className: defaultClassNames.weekday }),
        week: styles.week({ className: defaultClassNames.week }),
        week_number_header: styles.weekNumberHeader({
          className: defaultClassNames.week_number_header,
        }),
        week_number: styles.weekNumber({
          className: defaultClassNames.week_number,
        }),
        day: styles.day({ className: defaultClassNames.day }),
        range_start: styles.rangeStart({
          className: defaultClassNames.range_start,
        }),
        range_middle: styles.rangeMiddle({
          className: defaultClassNames.range_middle,
        }),
        range_end: styles.rangeEnd({
          className: defaultClassNames.range_end,
        }),
        today: styles.today({ className: defaultClassNames.today }),
        outside: styles.outside({ className: defaultClassNames.outside }),
        disabled: styles.disabled({
          className: defaultClassNames.disabled,
        }),
        hidden: styles.hidden(),
        ...classNames,
      }}
      components={{
        Root: ({ className, rootRef, ...rootProps }) => {
          return (
            <div
              data-slot="calendar"
              ref={rootRef}
              className={className}
              {...rootProps}
            />
          );
        },
        DayButton: CalendarDayButton,
        WeekNumber: ({ children, ...weekNumberProps }) => (
          <td {...weekNumberProps}>
            <div className={styles.weekNumberCell()}>{children}</div>
          </td>
        ),
        PreviousMonthButton: ({ className, children, ...prevProps }) => {
          return (
            <IconButton
              variant="ghost"
              size="xs"
              className={styles.buttonPrevious({ className })}
              {...prevProps}
            >
              {children}
            </IconButton>
          );
        },
        NextMonthButton: ({ className, children, ...nextProps }) => {
          return (
            <IconButton
              variant="ghost"
              size="xs"
              className={styles.buttonNext({ className })}
              {...nextProps}
            >
              {children}
            </IconButton>
          );
        },

        Chevron: ({ orientation, ...chevronProps }) => {
          if (orientation === "left")
            return <ChevronLeftIcon {...chevronProps} />;
          if (orientation === "right")
            return <ChevronRightIcon {...chevronProps} />;
          return <ChevronDownIcon {...chevronProps} />;
        },
        ...components,
      }}
      {...props}
    />
  );
}
