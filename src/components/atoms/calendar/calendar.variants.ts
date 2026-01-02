import type { VariantProps } from "tailwind-variants";
import { tv } from "tailwind-variants";

export const calendarVariants = tv({
  slots: {
    root: "group/calendar w-fit bg-transparent p-3",
    months: "relative flex flex-col gap-4 md:flex-row",
    month: "flex w-full flex-col gap-4",
    nav: "absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1",
    buttonPrevious: "",
    buttonNext: "",
    monthCaption: "flex h-8 w-full items-center justify-center px-8",
    captionLabel: "text-sm font-semibold select-none",
    // TODO: dropdown styles should match that of Select component
    dropdowns:
      "flex h-8 w-full items-center justify-center gap-1.5 text-sm font-semibold",
    dropdownRoot:
      "border-edge has-focus:border-primary has-focus:ring-primary/50 relative rounded-xl border shadow-xs has-focus:ring-[3px]",
    dropdown: "bg-foreground absolute inset-0 opacity-0",
    table: "w-full border-collapse",
    weekdays: "flex",
    weekday:
      "text-muted flex-1 rounded-xl text-xs font-normal select-none",
    week: "mt-2 flex w-full",
    weekNumberHeader: "w-8 select-none",
    weekNumber: "text-muted text-xs select-none",
    day: [
      "group/day relative aspect-square h-full w-full p-0 text-center select-none",
      "[&:first-child[data-selected=true]_button]:rounded-l-xl",
      "[&:last-child[data-selected=true]_button]:rounded-r-xl",
    ],
    rangeStart: "bg-secondary rounded-l-xl",
    rangeMiddle: "bg-secondary rounded-none",
    rangeEnd: "bg-secondary rounded-r-xl",
    today: "rounded-xl data-[selected=true]:rounded-none",
    outside: "text-muted aria-selected:text-muted",
    disabled: "text-muted opacity-50",
    hidden: "invisible",
    dayButton: [
      "data-[range-middle=true]:bg-secondary data-[range-middle=true]:text-primary data-[range-middle=true]:hover:bg-secondary data-[range-middle=true]:rounded-none",
      "data-[range-start=true]:bg-primary data-[range-start=true]:text-secondary data-[range-start=true]:hover:bg-primary-hover data-[range-start=true]:rounded-l-xl",
      "data-[range-end=true]:bg-primary data-[range-end=true]:text-secondary data-[range-end=true]:hover:bg-primary-hover data-[range-end=true]:rounded-r-xl",
      "data-[selected-single=true]:bg-primary data-[selected-single=true]:text-secondary data-[selected-single=true]:hover:bg-primary-hover",
    ],
    weekNumberCell: "flex size-8 items-center justify-center text-center",
  },
  variants: {
    showWeekNumber: {
      true: {
        day: "[&:first-child[data-selected=true]_button]:rounded-none [&:nth-child(2)[data-selected=true]_button]:rounded-l-xl",
      },
    },
    captionLayoutDropdown: {
      true: {
        captionLabel:
          "[&>svg]:text-muted flex h-8 items-center gap-1 rounded-xl pr-1 pl-2 [&>svg]:size-3.5",
      },
    },
  },
});

export type CalendarVariantsProps = VariantProps<typeof calendarVariants>;
