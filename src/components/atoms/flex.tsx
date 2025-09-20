import * as React from "react";
import { tv, type VariantProps } from "tailwind-variants";

export const flexTv = tv({
  base: "flex",
  variants: {
    direction: {
      row: "flex-row",
      col: "flex-col",
    },
    align: {
      start: "items-start",
      center: "items-center",
      end: "items-end",
      stretch: "items-stretch",
      baseline: "items-baseline",
    },
    justify: {
      start: "justify-start",
      center: "justify-center",
      end: "justify-end",
      between: "justify-between",
      around: "justify-around",
      evenly: "justify-evenly",
    },
    gap: {
      none: "gap-0",
      xs: "gap-1",
      sm: "gap-2",
      md: "gap-4",
      lg: "gap-6",
      xl: "gap-8",
    },
    grow: {
      true: "flex-1",
    },
    wrap: {
      nowrap: "flex-nowrap",
      wrap: "flex-wrap",
    },
    fullWidth: {
      true: "w-full",
    },
    fullHeight: {
      true: "h-full",
    },
  },
  defaultVariants: {
    direction: "row",
    align: "center",
    justify: "center",
    gap: "sm",
  },
});

export type FlexProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof flexTv> & {
    children?: React.ReactNode;
  };

export const Flex = React.forwardRef<HTMLDivElement, FlexProps>(
  (
    {
      className,
      direction,
      align,
      justify,
      gap,
      wrap,
      grow,
      fullWidth,
      fullHeight,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={flexTv({
          direction,
          align,
          justify,
          gap,
          wrap,
          grow,
          fullWidth,
          fullHeight,
          className,
        })}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Flex.displayName = "Flex";

export const Row = React.forwardRef<HTMLDivElement, FlexProps>(
  (props, ref) => {
    return <Flex ref={ref} direction="row" {...props} />;
  }
);

Row.displayName = "Row";

export const Stack = React.forwardRef<HTMLDivElement, FlexProps>(
  (props, ref) => {
    return <Flex ref={ref} direction="col" {...props} />;
  }
);

Stack.displayName = "Stack";

export default Flex;
