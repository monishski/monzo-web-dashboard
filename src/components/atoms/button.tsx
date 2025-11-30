import { forwardRef } from "react";
import { Slot } from "@radix-ui/react-slot";
import { tv, type VariantProps } from "tailwind-variants";

import type { ComponentPropsWithAsProp } from "@/types/utils";

export const buttonTv = tv({
  base: [
    "ring-offset-background inline-flex cursor-pointer items-center justify-center gap-2 rounded-md",
    "transition-colors duration-150 ease-in-out active:scale-95",
    "text-sm font-medium whitespace-nowrap",
    "focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
    "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  ],
  variants: {
    variant: {
      // TODO: avoid using opacities (see Radix how Radix colour tokens map to utilities https://www.radix-ui.com/colors)
      primary: "bg-primary text-overlay hover:bg-primary/90",
      secondary: "bg-secondary hover:bg-secondary/70",
      outline:
        "border-edge bg-background hover:bg-background-hover border",
      ghost: "hover:bg-background-hover",
      link: "text-primary underline-offset-4 hover:underline",
      destructive: "bg-negative text-overlay hover:bg-negative/90",
    },
    size: {
      sm: "h-9 px-3",
      md: "h-10 px-4 py-2",
      lg: "h-11 px-8",
    },
    disabled: {
      true: "disabled:pointer-events-none disabled:opacity-50",
    },
    icon: {
      true: "h-10 w-10",
    },
    fullWidth: {
      true: "w-full",
    },
  },
  compoundVariants: [
    { size: "sm", icon: true, class: "h-9 w-9" },
    { size: "md", icon: true, class: "h-10 w-10" },
    { size: "lg", icon: true, class: "h-11 w-11" },
  ],
  defaultVariants: {
    variant: "primary",
    size: "md",
  },
});

export type ButtonProps = ComponentPropsWithAsProp<"button"> &
  VariantProps<typeof buttonTv>;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      icon,
      disabled,
      fullWidth,
      asChild = false,
      ...props
    },
    ref
  ) => {
    const Component = asChild ? Slot : "button";
    return (
      <Component
        className={buttonTv({
          variant,
          size,
          icon,
          disabled,
          className,
          fullWidth,
        })}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
