import type { VariantProps } from "tailwind-variants";
import { tv } from "tailwind-variants";

import { textVariants } from "../typography";

export const inputVariants = tv({
  slots: {
    inputGroup: "group leading-none",
    inputLabel: "flex items-center gap-2 [&_svg]:size-4 [&_svg]:shrink-0",
    inputDescription: "text-muted",
    input: [
      textVariants({ size: "sm" }),
      "peer bg-foreground border-edge h-9 w-full rounded-lg border py-1 pr-9 pl-3 shadow-xs transition-[color,box-shadow]",
      "placeholder:text-muted",
      "selection:bg-primary selection:text-secondary",
      "focus-visible:ring-edge focus-visible:border-primary focus-visible:ring-[3px] focus-visible:outline-none",
    ],
    inputLeftIcon:
      "absolute top-1/2 left-3 -translate-y-1/2 [&_svg]:size-4 [&_svg]:shrink-0",
    inputRightIconButtons: "absolute top-1/2 right-2 -translate-y-1/2",
  },
  variants: {
    disabled: {
      true: {
        input:
          "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
      },
    },
    error: {
      true: {
        input: [
          "ring-error-backdrop border-error ring-[3px]",
          "focus-visible:ring-error-backdrop focus-visible:border-error",
        ],
        inputDescription: "text-error",
      },
    },
    hasLeftIcon: {
      true: {
        input: "pl-9",
      },
    },
    hasRightIconButton: {
      true: {
        input: "pr-16",
      },
    },
  },
});

export type InputVariantsProps = VariantProps<typeof inputVariants>;
