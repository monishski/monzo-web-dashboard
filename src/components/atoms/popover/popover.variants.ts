import type { VariantProps } from "tailwind-variants";
import { tv } from "tailwind-variants";

export const popoverVariants = tv({
  base: [
    "bg-foreground border-edge z-50 mx-2 w-min min-w-56 origin-(--radix-popover-content-transform-origin) rounded-xl border p-4 shadow-md outline-hidden",
    "data-[state=open]:animate-in data-[state=closed]:animate-out",
    "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
    "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
    "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
    "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
  ],
});

export type PopoverVariantsProps = VariantProps<typeof popoverVariants>;
