import type { VariantProps } from "tailwind-variants";
import { tv } from "tailwind-variants";

export const textVariants = tv({
  base: ["leading-none"],
  variants: {
    size: {
      sm: "text-sm",
      base: "text-base",
      lg: "text-lg",
    },
    weight: {
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
    },
    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    },
    color: {
      font: "text-font",
      muted: "text-muted",
      primary: "text-primary",
      error: "text-error",
      success: "text-success",
      warning: "text-warning",
      info: "text-info",
    },
    fullWidth: {
      true: "w-full",
    },
  },
  defaultVariants: {
    size: "base",
    weight: "normal",
    align: "left",
    color: "font",
    fullWidth: true,
  },
});

export type TextVariantsProps = VariantProps<typeof textVariants>;
export type TextDefaultVariants = typeof textVariants.defaultVariants;
