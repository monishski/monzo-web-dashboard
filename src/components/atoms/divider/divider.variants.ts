import type { VariantProps } from "tailwind-variants";
import { tv } from "tailwind-variants";

export const dividerVariants = tv({
  base: "border-edge",
  variants: {
    orientation: {
      horizontal: "w-full border-b",
      vertical: "flex h-auto items-center self-stretch border-r",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
  },
});

export type DividerVariantsProps = VariantProps<typeof dividerVariants>;
