import type { VariantProps } from "tailwind-variants";
import { tv } from "tailwind-variants";

import { getObjectKeys } from "@/utils/object";

import type { textColorsVariantMap, textSizesVariantMap } from "../text";
import { textVariants } from "../text";

export const buttonVariantVariantMap = {
  // TODO: avoid using opacities (see Radix how Radix colour tokens map to utilities https://www.radix-ui.com/colors)
  primary: "bg-primary hover:bg-primary-hover",
  secondary: "bg-secondary hover:bg-secondary-hover",
  outline: "border-edge hover:bg-secondary-hover border",
  ghost: "hover:bg-secondary-hover",
  link: "underline-offset-4 hover:underline",
  destructive: "bg-negative hover:bg-negative-hover",
} as const;

export const buttonSizesVariantMap = {
  sm: "h-9 px-3 [&_svg]:size-4",
  md: "h-10 px-4 [&_svg]:size-4.5 ",
  lg: "h-11 px-5 [&_svg]:size-5",
} as const;

const buttonSizeToTextSize: Record<
  keyof typeof buttonSizesVariantMap,
  keyof typeof textSizesVariantMap
> = {
  sm: "sm",
  md: "base",
  lg: "lg",
};

const buttonVariantToTextColor: Record<
  keyof typeof buttonVariantVariantMap,
  keyof typeof textColorsVariantMap
> = {
  primary: "secondary",
  secondary: "primary",
  outline: "primary",
  ghost: "primary",
  link: "primary",
  destructive: "overlay",
};

// Utility function to generate all compound variants for size × variant combinations with text
function getButtonCompoundVariantsWithText(): {
  size: keyof typeof buttonSizesVariantMap;
  variant: keyof typeof buttonVariantVariantMap;
  class: string;
}[] {
  const sizes = getObjectKeys(buttonSizesVariantMap);
  const variants = getObjectKeys(buttonVariantVariantMap);

  return sizes.flatMap((size) =>
    variants.map((variant) => ({
      size,
      variant,
      class: textVariants({
        size: buttonSizeToTextSize[size],
        color: buttonVariantToTextColor[variant],
        fullWidth: false,
      }),
    }))
  );
}

export const buttonVariants = tv({
  base: [
    "inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl",
    "transition-colors duration-150 ease-in-out active:scale-95",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
  ],
  variants: {
    variant: buttonVariantVariantMap,
    size: buttonSizesVariantMap,
    disabled: {
      true: "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
    },
    icon: {
      true: "h-10 w-10",
    },
    fullWidth: {
      true: "w-full",
    },
  },
  compoundVariants: [
    { size: "sm", icon: true, class: "h-9 w-9 rounded-xl p-0" },
    { size: "md", icon: true, class: "h-10 w-10 rounded-xl p-0" },
    { size: "lg", icon: true, class: "h-11 w-11 rounded-xl p-0" },
    ...getButtonCompoundVariantsWithText(),
  ],
  defaultVariants: {
    variant: "primary",
    size: "md",
    disabled: false,
    icon: false,
    fullWidth: false,
  },
});

export type ButtonVariantsProps = VariantProps<typeof buttonVariants>;
