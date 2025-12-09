import type { ComponentProps } from "react";
import * as LabelPrimitive from "@radix-ui/react-label";

import { getVariantProps } from "@/utils/tailwind-variants";

import type { LabelVariantProps } from "./label.variants";
import { labelVariants } from "./label.variants";

type LabelProps = ComponentProps<typeof LabelPrimitive.Root> &
  LabelVariantProps;

export function Label({
  className,
  ...props
}: LabelProps): React.JSX.Element {
  const { variantProps, componentProps } = getVariantProps(
    props,
    labelVariants.variantKeys
  );

  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={labelVariants({ ...variantProps, className })}
      {...componentProps}
    />
  );
}
