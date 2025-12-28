import type { VariantProps } from "tailwind-variants";
import { tv } from "tailwind-variants";

export const spinnerVariants = tv({
  base: ["text-font inline-block animate-spin"],
  variants: {
    size: {
      xs: "h-3 w-3",
      sm: "h-4 w-4",
      md: "h-5 w-5",
      lg: "h-6 w-6",
      xl: "h-8 w-8",
    },
  },
  defaultVariants: {
    size: "sm",
  },
});

export type SpinnerVariantProps = VariantProps<typeof spinnerVariants>;
