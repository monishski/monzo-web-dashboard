import type { VariantProps } from "tailwind-variants";
import { tv } from "tailwind-variants";

export const flexVariants = tv({
  base: "flex",
  variants: {
    direction: {
      row: "flex-row",
      col: "flex-col",
    },
    align: {
      start: "items-start",
      center: "items-center",
      end: "items-end",
      stretch: "items-stretch",
      baseline: "items-baseline",
    },
    justify: {
      start: "justify-start",
      center: "justify-center",
      end: "justify-end",
      between: "justify-between",
      around: "justify-around",
      evenly: "justify-evenly",
    },
    gap: {
      none: "gap-0",
      xs: "gap-1",
      sm: "gap-2",
      md: "gap-4",
      lg: "gap-6",
      xl: "gap-8",
    },
    grow: {
      true: "flex-1",
    },
    wrap: {
      nowrap: "flex-nowrap",
      wrap: "flex-wrap",
    },
    fullWidth: {
      true: "w-full",
    },
    fullHeight: {
      true: "h-full",
    },
  },
  defaultVariants: {
    direction: "row",
    align: "center",
    justify: "center",
    gap: "sm",
  },
});

export type FlexVariantProps = VariantProps<typeof flexVariants>;
