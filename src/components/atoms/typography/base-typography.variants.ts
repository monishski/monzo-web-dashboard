import { tv } from "tailwind-variants";

export const baseTypographyVariants = tv({
  base: ["leading-none tracking-tight text-balance"],
  variants: {
    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    },
    color: {
      font: "text-font",
      muted: "text-muted",
      primary: "text-primary",
      secondary: "text-secondary",
      overlay: "text-overlay",
      error: "text-error",
      success: "text-success",
      warning: "text-warning",
      info: "text-info",
    },
    fullWidth: {
      true: "w-full",
    },
    truncate: {
      true: "truncate text-nowrap",
    },
  },
  defaultVariants: {
    align: "left",
    color: "font",
    fullWidth: true,
  },
});
