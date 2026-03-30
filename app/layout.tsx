import type { Metadata } from "next";

import { FloatingContactMenu } from "@/components/floating-contact-menu";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { ThemeScript } from "@/components/theme-script";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Kuma Docs",
    template: "%s | Kuma Docs",
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
        <MobileBottomNav />
        <FloatingContactMenu />
      </body>
    </html>
  );
}
