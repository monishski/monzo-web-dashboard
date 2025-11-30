import type { Metadata } from "next";

import "./globals.css";
import "react-day-picker/style.css";

import type { JSX } from "react";

import { Provider } from "@/components/provider";

export const metadata: Metadata = {
  title: "Monzo Dashboard",
};

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function RootLayout({
  children,
}: RootLayoutProps): JSX.Element {
  return (
    <html suppressHydrationWarning>
      <body className="bg-background text-font flex min-h-screen">
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
