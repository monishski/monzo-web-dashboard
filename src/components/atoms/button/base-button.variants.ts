import { tv } from "tailwind-variants";

export const baseButtonVariants = tv({
  base: [
    "inline-flex shrink-0 cursor-pointer items-center justify-center gap-2",
    "transition-colors duration-150 ease-in-out active:scale-95",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
    "tracking-tight text-balance",
  ],
  variants: {
    variant: {
      primary: "bg-primary hover:bg-primary-hover text-secondary",
      secondary: "bg-secondary hover:bg-secondary-hover text-primary",
      outline: "border-edge hover:bg-secondary-hover text-primary border",
      ghost: "hover:bg-secondary-hover text-primary",
      destructive:
        "bg-negative-backdrop hover:bg-negative-hover !text-negative text-semibold",
    },
    disabled: {
      true: "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
    },
  },
  defaultVariants: {
    variant: "primary",
    disabled: false,
  },
});
