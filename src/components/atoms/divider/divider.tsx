"use client";

import type { ComponentProps } from "react";
import * as SeparatorPrimitive from "@radix-ui/react-separator";

import { getVariantProps } from "@/utils/tailwind-variants";

import type { DividerVariantsProps } from "./divider.variants";
import { dividerVariants } from "./divider.variants";

type DividerProps = ComponentProps<typeof SeparatorPrimitive.Root> &
  DividerVariantsProps;

export function Divider({
  className,
  decorative = true,
  ...props
}: DividerProps): React.JSX.Element {
  const { variantProps, componentProps } = getVariantProps(
    props,
    dividerVariants.variantKeys
  );

  return (
    <SeparatorPrimitive.Root
      data-slot="separator"
      decorative={decorative}
      className={dividerVariants({ ...variantProps, className })}
      {...componentProps}
    />
  );
}
