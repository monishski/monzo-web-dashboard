"use client";

import type { ComponentProps, JSX } from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";

import { getVariantProps } from "@/utils/tailwind-variants";

import {
  popoverVariants,
  type PopoverVariantsProps,
} from "./popover.variants";

export type PopoverProps = ComponentProps<typeof PopoverPrimitive.Root>;

export function Popover({ ...props }: PopoverProps): JSX.Element {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />;
}

export type PopoverTriggerProps = ComponentProps<
  typeof PopoverPrimitive.Trigger
>;

export function PopoverTrigger({
  ...props
}: PopoverTriggerProps): JSX.Element {
  return (
    <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />
  );
}

export type PopoverContentProps = ComponentProps<
  typeof PopoverPrimitive.Content
> &
  PopoverVariantsProps;

export function PopoverContent({
  className,
  align = "center",
  sideOffset = 4,
  ...props
}: PopoverContentProps): JSX.Element {
  const { variantProps, componentProps } = getVariantProps(
    props,
    popoverVariants.variantKeys
  );

  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        data-slot="popover-content"
        align={align}
        sideOffset={sideOffset}
        className={popoverVariants({ ...variantProps, className })}
        {...componentProps}
      />
    </PopoverPrimitive.Portal>
  );
}

export type PopoverAnchorProps = ComponentProps<
  typeof PopoverPrimitive.Anchor
>;

export function PopoverAnchor({
  ...props
}: PopoverAnchorProps): JSX.Element {
  return <PopoverPrimitive.Anchor data-slot="popover-anchor" {...props} />;
}
