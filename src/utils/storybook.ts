import type { ArgTypes } from "@storybook/nextjs-vite";

import type { PropsToVariants } from "@/types/utils";

import { getObjectKeys } from "./object";

export function getVariantArgTypes<VariantProps>({
  variants,
  defaultVariants,
  descriptions,
}: {
  variants: PropsToVariants<VariantProps>;
  defaultVariants: Partial<VariantProps>;
  descriptions: Record<keyof VariantProps, string>;
}): ArgTypes<VariantProps> {
  return getObjectKeys(variants).reduce((acc, key) => {
    const options = getObjectKeys(variants[key]);
    acc[key] = {
      control: options.some((option) =>
        ["true", "false"].includes(String(option))
      )
        ? "boolean"
        : "select",
      options,
      description: descriptions?.[key],
      table: {
        defaultValue: { summary: String(defaultVariants[key]) },
        // REF: https://stackoverflow.com/a/75285864
        type: { summary: options.join(" | ") },
      },
    };
    return acc;
  }, {} as ArgTypes<VariantProps>);
}
