import type { ComponentProps } from "react";
import type { VariantProps } from "tailwind-variants";
import { tv } from "tailwind-variants";

import { getVariantProps } from "@/utils/tailwind-variants";

import { textVariants } from "../text/text.variants";

export const inputVariants = tv({
  base: [
    textVariants({ size: "sm" }),
    "bg-background border-edge h-9 w-full rounded-lg border px-3 py-1 shadow-xs transition-[color,box-shadow]",
    "placeholder:text-muted",
    "selection:bg-primary selection:text-secondary",
    "focus-visible:ring-edge focus-visible:border-primary focus-visible:ring-[3px] focus-visible:outline-none",
    "aria-invalid:ring-error/20 aria-invalid:border-error aria-invalid:ring-[3px]",
  ],
  variants: {
    disabled: {
      true: {
        base: "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
      },
    },
  },
});

export type InputVariantProps = VariantProps<typeof inputVariants>;

type InputProps = ComponentProps<"input"> & InputVariantProps;

export function Input({
  className,
  ...props
}: InputProps): React.JSX.Element {
  const { variantProps, componentProps } = getVariantProps(
    props,
    inputVariants.variantKeys
  );

  return (
    <input
      data-slot="input"
      disabled={variantProps.disabled}
      className={inputVariants({
        ...variantProps,
        className,
      })}
      {...componentProps}
    />
  );
}
