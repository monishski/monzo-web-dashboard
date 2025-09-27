"use client";

import {
  MutationCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AxiosError } from "axios";
import { ThemeProvider } from "next-themes";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import { signOut } from "@/lib/auth/auth-client";
import { useGlobalEffect } from "@/hooks/use-global-effect";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
  mutationCache: new MutationCache({
    onError: (error): void => {
      if (error instanceof AxiosError) {
        if (error.status === 401) {
          signOut();
        }
      }
    },
  }),
});

export const Provider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  useGlobalEffect();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="data-theme"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <NuqsAdapter>{children}</NuqsAdapter>
      </ThemeProvider>

      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};
