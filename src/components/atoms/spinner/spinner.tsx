import type { ComponentProps } from "react";
import { Loader2 } from "lucide-react";

import { getVariantProps } from "@/utils/tailwind-variants";

import type { SpinnerVariantProps } from "./spinner.variants";
import { spinnerVariants } from "./spinner.variants";

type SpinnerProps = ComponentProps<typeof Loader2> & SpinnerVariantProps;

export function Spinner({
  className,
  ...props
}: SpinnerProps): React.JSX.Element {
  const { variantProps, componentProps } = getVariantProps(
    props,
    spinnerVariants.variantKeys
  );

  return (
    <Loader2
      data-slot="spinner"
      className={spinnerVariants({ ...variantProps, className })}
      aria-label="Loading"
      {...componentProps}
    />
  );
}
