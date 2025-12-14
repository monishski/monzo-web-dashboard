import type { VariantProps } from "tailwind-variants";
import { tv } from "tailwind-variants";

import { baseTypographyVariants } from "./base-typography.variants";

export const textVariants = tv({
  extend: baseTypographyVariants,
  variants: {
    size: {
      xs: "text-xs",
      sm: "text-sm",
      base: "text-base",
      lg: "text-lg",
    },
    weight: {
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
    },
  },
  defaultVariants: {
    size: "base",
    weight: "normal",
  },
});

export type TextVariantsProps = VariantProps<typeof textVariants>;
