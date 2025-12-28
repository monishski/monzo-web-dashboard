import type { VariantProps } from "tailwind-variants";
import { tv } from "tailwind-variants";

import { baseButtonVariants } from "./base-button.variants";

export const iconButtonVariants = tv({
  extend: baseButtonVariants,
  variants: {
    size: {
      ["2xs"]: "h-6 w-6 rounded-lg p-0 [&_svg]:size-3",
      xs: "h-8 w-8 rounded-xl p-0 [&_svg]:size-3.5",
      sm: "h-9 w-9 rounded-xl p-0 [&_svg]:size-4",
      md: "h-10 w-10 rounded-xl p-0 [&_svg]:size-4.5",
      lg: "h-11 w-11 rounded-xl p-0 [&_svg]:size-5",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

export type IconButtonVariantsProps = VariantProps<
  typeof iconButtonVariants
>;
