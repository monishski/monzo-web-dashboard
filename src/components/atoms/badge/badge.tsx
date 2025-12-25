import { Slot } from "@radix-ui/react-slot";

import { getVariantProps } from "@/utils/tailwind-variants";
import type { ComponentPropsWithAsProp } from "@/types/utils";

import type { BadgeVariantProps } from "./badge.variants";
import { badgeVariants } from "./badge.variants";

export type BadgeProps = ComponentPropsWithAsProp<"span"> &
  BadgeVariantProps;

export function Badge({
  className,
  asChild = false,
  ...props
}: BadgeProps): React.JSX.Element {
  const { variantProps, componentProps } = getVariantProps(
    props,
    badgeVariants.variantKeys
  );

  const Component = asChild ? Slot : "span";

  return (
    <Component
      className={badgeVariants({ ...variantProps, className })}
      {...componentProps}
    />
  );
}
