import type { VariantProps } from "tailwind-variants";
import { tv } from "tailwind-variants";

export const headingSizesVariantMap = {
  h1: "text-4xl",
  h2: "text-3xl",
  h3: "text-2xl",
  h4: "text-xl",
  h5: "text-lg",
  h6: "text-base",
} as const;

export const headingWeightsVariantMap = {
  semibold: "font-semibold",
  bold: "font-bold",
} as const;

export const headingAlignmentsVariantMap = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
} as const;

export const headingColorsVariantMap = {
  font: "text-font",
  muted: "text-muted",
  primary: "text-primary",
  error: "text-error",
  success: "text-success",
  warning: "text-warning",
  info: "text-info",
} as const;

export const headingVariants = tv({
  base: ["leading-none tracking-tight text-balance"],
  variants: {
    as: headingSizesVariantMap,
    weight: headingWeightsVariantMap,
    align: headingAlignmentsVariantMap,
    color: headingColorsVariantMap,
    fullWidth: {
      true: "w-full",
    },
    truncate: {
      true: "truncate text-nowrap",
    },
  },
  defaultVariants: {
    as: "h1",
    weight: "bold",
    align: "left",
    color: "font",
    fullWidth: true,
  },
});

export type HeadingVariantsProps = VariantProps<typeof headingVariants>;
