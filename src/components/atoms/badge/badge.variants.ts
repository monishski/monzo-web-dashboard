import type { VariantProps } from "tailwind-variants";
import { tv } from "tailwind-variants";

export const badgeVariants = tv({
  base: [
    "w-fit rounded-full px-2 py-0.5",
    "inline-flex shrink-0 items-center justify-center gap-1 overflow-hidden",
    "text-xs font-semibold whitespace-nowrap",
    "transition-[color,box-shadow]",
    "[&>svg]:pointer-events-none [&>svg]:size-3",
  ],
  variants: {
    variant: {
      primary: "bg-primary text-secondary [a&]:hover:bg-primary-hover",
      secondary: "bg-secondary text-primary [a&]:hover:bg-secondary-hover",
      outline:
        "text-primary border-edge [a&]:hover:bg-secondary-hover border",
      link: "text-primary underline-offset-4 hover:underline",
      info: "bg-info-backdrop text-info [a&]:hover:bg-info-hover",
      success:
        "bg-success-backdrop text-success [a&]:hover:bg-success-hover",
      warning:
        "bg-warning-backdrop text-warning [a&]:hover:bg-warning-hover",
      error: "bg-error-backdrop text-error [a&]:hover:bg-error-hover",
    },
  },
  defaultVariants: {
    variant: "primary",
  },
});

export type BadgeVariantProps = VariantProps<typeof badgeVariants>;
