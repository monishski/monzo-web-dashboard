import { forwardRef, type ComponentPropsWithoutRef } from "react";

import { getVariantProps } from "@/utils/tailwind-variants";

import { flexVariants, type FlexVariantProps } from "./flex.variants";

export type FlexProps = ComponentPropsWithoutRef<"div"> & FlexVariantProps;

export const Flex = forwardRef<HTMLDivElement, FlexProps>(
  ({ children, className, ...props }, ref) => {
    const { variantProps, componentProps } = getVariantProps(
      props,
      flexVariants.variantKeys
    );

    return (
      <div
        ref={ref}
        className={flexVariants({ ...variantProps, className })}
        {...componentProps}
      >
        {children}
      </div>
    );
  }
);

Flex.displayName = "Flex";

export const Row = forwardRef<HTMLDivElement, FlexProps>((props, ref) => {
  return <Flex ref={ref} direction="row" {...props} />;
});

Row.displayName = "Row";

export const Stack = forwardRef<HTMLDivElement, FlexProps>(
  (props, ref) => {
    return <Flex ref={ref} direction="col" {...props} />;
  }
);

Stack.displayName = "Stack";
