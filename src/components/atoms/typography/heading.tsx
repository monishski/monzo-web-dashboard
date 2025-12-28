import type { ComponentPropsWithoutRef } from "react";
import { forwardRef } from "react";

import { getVariantProps } from "@/utils/tailwind-variants";

import type { HeadingVariantsProps } from "./heading.variants";
import { headingVariants } from "./heading.variants";

export type HeadingProps = ComponentPropsWithoutRef<
  "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
> &
  HeadingVariantsProps;

export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ children, className, ...props }, ref) => {
    const { variantProps, componentProps } = getVariantProps(
      props,
      headingVariants.variantKeys
    );

    const Component = variantProps.as || "h1";

    return (
      <Component
        ref={ref}
        className={headingVariants({
          ...variantProps,
          className,
        })}
        {...componentProps}
      >
        {children}
      </Component>
    );
  }
);

Heading.displayName = "Heading";
