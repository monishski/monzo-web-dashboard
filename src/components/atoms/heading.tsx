import * as React from "react";
import { forwardRef } from "react";
import { tv, type VariantProps } from "tailwind-variants";

import type { PolymorphicProps } from "@/types/utils";

export const headingTv = tv({
  base: ["leading-none"],
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
  },
  defaultVariants: {
    as: "h1",
    weight: "semibold",
    align: "left",
    color: "font",
  },
});

export type HeadingProps = PolymorphicProps<
  "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
> &
  VariantProps<typeof headingTv>;

export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  (
    { className, as = "h1", weight, align, color, children, ...props },
    ref
  ) => {
    const Component = as;
    return (
      <Component
        ref={ref}
        className={headingTv({
          as,
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

Heading.displayName = "Heading";
