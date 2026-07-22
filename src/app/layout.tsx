import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CastFlow",
  description: "Base portfolio tracker on Farcaster",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
