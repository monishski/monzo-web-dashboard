import { forwardRef } from "react";
import { Slot } from "@radix-ui/react-slot";

import { getVariantProps } from "@/utils/tailwind-variants";
import type { ComponentPropsWithAsProp } from "@/types/utils";

import type { IconButtonVariantsProps } from "./icon-button.variants";
import { iconButtonVariants } from "./icon-button.variants";

export type IconButtonProps = ComponentPropsWithAsProp<"button"> &
  IconButtonVariantsProps;

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const { variantProps, componentProps } = getVariantProps(props, [
      ...iconButtonVariants.extend.variantKeys,
      ...iconButtonVariants.variantKeys,
    ]);

    const Component = asChild ? Slot : "button";

    const disabled =
      variantProps.disabled || Boolean(componentProps["aria-disabled"]);

    return (
      <Component
        disabled={disabled}
        className={iconButtonVariants({
          ...variantProps,
          disabled,
          className,
        })}
        ref={ref}
        {...componentProps}
      />
    );
  }
);

IconButton.displayName = "IconButton";
