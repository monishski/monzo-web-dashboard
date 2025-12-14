import type { VariantProps } from "tailwind-variants";
import { tv } from "tailwind-variants";

import { baseButtonVariants } from "./base-button.variants";

export const buttonVariants = tv({
  extend: baseButtonVariants,
  base: ["rounded-xl tracking-tight text-balance"],
  variants: {
    size: {
      sm: "h-9 px-3 text-sm [&_svg]:size-4",
      md: "h-10 px-4 text-base [&_svg]:size-4.5",
      lg: "h-11 px-5 text-lg [&_svg]:size-5",
    },
    fullWidth: {
      true: "w-full",
    },
  },
  defaultVariants: {
    size: "md",
    fullWidth: false,
  },
});

export type ButtonVariantsProps = VariantProps<typeof buttonVariants>;
