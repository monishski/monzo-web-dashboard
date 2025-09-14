"use client";

import * as SeparatorPrimitive from "@radix-ui/react-separator";
import { tv } from "tailwind-variants";

const dividerTv = tv({
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

type DividerProps = React.ComponentProps<typeof SeparatorPrimitive.Root>;

export function Divider({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}: DividerProps): React.JSX.Element {
  return (
    <SeparatorPrimitive.Root
      data-slot="separator"
      decorative={decorative}
      orientation={orientation}
      className={dividerTv({ orientation, className })}
      {...props}
    />
  );
}
