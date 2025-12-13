import type { ComponentProps } from "react";
import React from "react";
import type { VariantProps } from "tailwind-variants";
import { tv } from "tailwind-variants";

import { getVariantProps } from "@/utils/tailwind-variants";

import { Stack } from "../flex";
import { Label } from "../label";
import { Text } from "../text";
import { textVariants } from "../text/text.variants";

export const inputVariants = tv({
  slots: {
    inputGroup: "group",
    input: [
      textVariants({ size: "sm" }),
      "peer bg-background border-edge h-9 w-full rounded-lg border px-3 py-1 shadow-xs transition-[color,box-shadow]",
      "placeholder:text-muted",
      "selection:bg-primary selection:text-secondary",
      "focus-visible:ring-edge focus-visible:border-primary focus-visible:ring-[3px] focus-visible:outline-none",
    ],
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
          "ring-error/20 border-error ring-[3px]",
          "focus-visible:ring-error/10 focus-visible:border-error",
        ],
      },
    },
  },
});

export type InputVariantProps = VariantProps<typeof inputVariants>;

type InputProps = {
  label: string;
  labelIcon?: React.ReactNode;
  error?: string;
} & ComponentProps<"input"> &
  Omit<InputVariantProps, "error">;

export function Input({
  className,
  label,
  labelIcon,
  error,
  ...props
}: InputProps): React.JSX.Element {
  const { variantProps, componentProps: inputProps } = getVariantProps(
    props,
    inputVariants.variantKeys
  );

  const { inputGroup, input } = inputVariants({
    ...variantProps,
    error: Boolean(error),
    className,
  });

  return (
    <Stack
      gap="xs"
      fullWidth
      className={inputGroup()}
      data-disabled={JSON.stringify(variantProps.disabled)}
      data-invalid={JSON.stringify(Boolean(error))}
    >
      <Label htmlFor={props.id}>
        {labelIcon}
        {label}
      </Label>
      <input
        className={input()}
        disabled={variantProps.disabled}
        {...inputProps}
      />
      {error && (
        <Text size="xs" color="error">
          {error}
        </Text>
      )}
    </Stack>
  );
}
