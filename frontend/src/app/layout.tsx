import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Web3Provider } from "@/providers/Web3Provider";
import { FarcasterProvider } from "@/providers/FarcasterProvider";
import "@/styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CastFlow – Decentralized Ad Protocol",
  description: "Monetize your Farcaster casts with onchain ads",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-background text-white min-h-screen`}>
        <Web3Provider>
          <FarcasterProvider>
            {children}
          </FarcasterProvider>
        </Web3Provider>
      </body>
    </html>
  );
}