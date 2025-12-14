import type { VariantProps } from "tailwind-variants";
import { tv } from "tailwind-variants";

import { baseTypographyVariants } from "./base-typography.variants";

export const headingVariants = tv({
  extend: baseTypographyVariants,
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
  },
  defaultVariants: {
    as: "h1",
    weight: "bold",
  },
});

export type HeadingVariantsProps = VariantProps<typeof headingVariants>;
