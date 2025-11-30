import { forwardRef } from "react";
import { tv, type VariantProps } from "tailwind-variants";

import type { PolymorphicProps } from "@/types/utils";

export const textTv = tv({
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
  },
  defaultVariants: {
    size: "base",
    weight: "normal",
    align: "left",
    color: "font",
  },
});

type TextProps = PolymorphicProps<"p" | "span"> &
  VariantProps<typeof textTv>;

export const Text = forwardRef<
  HTMLParagraphElement & HTMLSpanElement,
  TextProps
>(
  (
    {
      className,
      as = "span",
      size,
      weight,
      align,
      color,
      children,
      ...props
    },
    ref
  ) => {
    const Component = as;

    return (
      <Component
        ref={ref}
        className={textTv({
          size,
          weight,
          align,
          color,
          className,
        })}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Text.displayName = "Text";
