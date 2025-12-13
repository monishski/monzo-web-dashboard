import type { VariantProps } from "tailwind-variants";
import { tv } from "tailwind-variants";

import { headingVariants } from "../heading";

export const labelVariants = tv({
  base: [
    headingVariants({ as: "h6", weight: "semibold" }),
    "flex items-center gap-2 select-none",
    "group-data-[disabled=true]:text-muted group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50",
    "peer-disabled:text-muted peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
    "group-data-[invalid=true]:text-error",
    "peer-invalid:text-error",
  ],
});

export type LabelVariantProps = VariantProps<typeof labelVariants>;
