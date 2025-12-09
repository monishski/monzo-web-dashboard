import type { ComponentProps } from "react";

import { getVariantProps } from "@/utils/tailwind-variants";

import { paperVariants, type PaperVariantProps } from "./paper.variants";

type PaperProps = ComponentProps<"div"> & PaperVariantProps;

export function Paper({
  className,
  ...props
}: PaperProps): React.JSX.Element {
  const { variantProps, componentProps } = getVariantProps(
    props,
    paperVariants.variantKeys
  );

  return (
    <div
      data-slot="card"
      className={paperVariants({ ...variantProps, className })}
      {...componentProps}
    />
  );
}
