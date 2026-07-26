import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

const APP_URL = "https://castflow-frontend.vercel.app";

export const metadata: Metadata = {
  title: "CastFlow",
  description: "Sell sponsored cast slots on Farcaster. Get paid on Base.",
  openGraph: {
    title: "CastFlow",
    description: "Sell sponsored cast slots on Farcaster. Get paid on Base.",
    images: [{ url: `${APP_URL}/api/branding?type=preview`, width: 1200, height: 630 }],
  },
  other: {
    "base:app_id": "6a6122b3078f6baf9ef30258",
    "talentapp:project_verification": "c9960549d80665cd506cf9d2050147b5de34ddf55496eb62cae14d0546bc7512c3db3a487762e63b666bbf06aaa51ce63c51bf03492e5d7f8ab1e5e4a8a32095",
    "fc:miniapp": JSON.stringify({
      version: "1",
      imageUrl: `${APP_URL}/api/branding?type=preview`,
      button: {
        title: "Open CastFlow",
        action: {
          type: "launch_frame",
          name: "CastFlow",
          url: APP_URL,
          splashImageUrl: `${APP_URL}/api/branding?type=splash`,
          splashBackgroundColor: "#0A0B0D",
        },
      },
    }),
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-background text-white min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
