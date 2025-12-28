import type { VariantProps } from "tailwind-variants";
import { tv } from "tailwind-variants";

export const paperVariants = tv({
  base: "bg-foreground border-edge rounded-2xl border p-4 shadow-md",
});

export type PaperVariantProps = VariantProps<typeof paperVariants>;
