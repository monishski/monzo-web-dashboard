import type { VariantProps } from "tailwind-variants";
import { tv } from "tailwind-variants";

export const headingVariants = tv({
  base: ["leading-none tracking-tight text-balance"],
  variants: {
    as: {
      h1: "text-4xl",
      h2: "text-3xl",
      h3: "text-2xl",
      h4: "text-xl",
      h5: "text-lg",
      h6: "text-base",
    },
    weight: {
      semibold: "font-semibold",
      bold: "font-bold",
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
    as: "h1",
    weight: "bold",
    align: "left",
    color: "font",
    fullWidth: true,
  },
});

export type HeadingVariantsProps = VariantProps<typeof headingVariants>;
