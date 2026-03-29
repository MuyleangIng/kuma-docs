import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Next-KHQR-Demo",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#f8fafc" }}>{children}</body>
    </html>
  );
}
