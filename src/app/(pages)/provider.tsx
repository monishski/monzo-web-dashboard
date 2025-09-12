"use client";

import { NuqsAdapter } from "nuqs/adapters/next/app";

export const Provider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <NuqsAdapter>{children}</NuqsAdapter>;
};
