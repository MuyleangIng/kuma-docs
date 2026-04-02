import type { Metadata } from "next";

import { FloatingContactMenu } from "@/components/floating-contact-menu";
import { ThemeScript } from "@/components/theme-script";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Koma KHQR Docs",
    template: "%s | Koma KHQR Docs",
  },
  description: "Standalone documentation website for the koma-khqr package.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html data-theme="dark" lang="en" suppressHydrationWarning>
      <body>
        <ThemeScript />
        {children}
        <FloatingContactMenu />
      </body>
    </html>
  );
}
