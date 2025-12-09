import { forwardRef } from "react";
import { Slot } from "@radix-ui/react-slot";

import { getVariantProps } from "@/utils/tailwind-variants";
import type { ComponentPropsWithAsProp } from "@/types/utils";

import type { ButtonVariantsProps } from "./button.variants";
import { buttonVariants } from "./button.variants";

export type ButtonProps = ComponentPropsWithAsProp<"button"> &
  ButtonVariantsProps;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const { variantProps, componentProps } = getVariantProps(
      props,
      buttonVariants.variantKeys
    );

    const Component = asChild ? Slot : "button";

    return (
      <Component
        disabled={variantProps.disabled}
        className={buttonVariants({
          ...variantProps,
          className,
        })}
        ref={ref}
        {...componentProps}
      />
    );
  }
);

Button.displayName = "Button";
