"use client";

import React from "react";
import { AuthKitProvider } from "@farcaster/auth-kit";

const farcasterConfig = {
  domain: process.env.NEXT_PUBLIC_DOMAIN || "castflow.xyz",
  siweUri: typeof window !== "undefined" ? window.location.origin : "https://castflow.xyz",
};

export function FarcasterProvider({ children }: { children: React.ReactNode }) {
  return (
    <AuthKitProvider config={farcasterConfig}>
      {children}
    </AuthKitProvider>
  );
}