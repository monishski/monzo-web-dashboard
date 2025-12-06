import { forwardRef } from "react";

import { getVariantProps } from "@/utils/tailwind-variants";
import type { PolymorphicProps } from "@/types/utils";

import { textVariants, type TextVariantsProps } from "./text.variants";

type TextProps = PolymorphicProps<"p" | "span"> & TextVariantsProps;

export const Text = forwardRef<
  HTMLParagraphElement & HTMLSpanElement,
  TextProps
>(({ children, className, as = "span", ...props }, ref) => {
  const Component = as;

  const { variantProps, componentProps } = getVariantProps(
    props,
    textVariants.variantKeys
  );

  return (
    <Component
      ref={ref}
      className={textVariants({ ...variantProps, className })}
      {...componentProps}
    >
      {children}
    </Component>
  );
});

Text.displayName = "Text";
