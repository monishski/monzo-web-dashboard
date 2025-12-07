import type { VariantProps } from "tailwind-variants";
import { tv } from "tailwind-variants";

export const textSizesVariantMap = {
  sm: "text-sm",
  base: "text-base",
  lg: "text-lg",
} as const;

export const textWeightsVariantMap = {
  normal: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
} as const;

export const textAlignsVariantMap = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
} as const;

export const textColorsVariantMap = {
  font: "text-font",
  muted: "text-muted",
  primary: "text-primary",
  secondary: "text-secondary",
  overlay: "text-overlay",
  error: "text-error",
  success: "text-success",
  warning: "text-warning",
  info: "text-info",
} as const;

export const textVariants = tv({
  base: ["tracking-tight text-balance"],
  variants: {
    size: textSizesVariantMap,
    weight: textWeightsVariantMap,
    align: textAlignsVariantMap,
    color: textColorsVariantMap,
    fullWidth: {
      true: "w-full",
    },
    truncate: {
      true: "truncate text-nowrap",
    },
  },
  defaultVariants: {
    size: "base",
    weight: "normal",
    align: "left",
    color: "font",
    fullWidth: true,
    truncate: false,
  },
});

export type TextVariantsProps = VariantProps<typeof textVariants>;
