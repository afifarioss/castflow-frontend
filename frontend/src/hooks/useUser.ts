"use client";

import { useAccount } from "wagmi";
import { useProfile } from "@farcaster/auth-kit";

export function useUser() {
  const { address, isConnected: walletConnected } = useAccount();
  const { profile, isLoading: profileLoading } = useProfile();

  const fid = profile?.fid ?? null;
  const isConnected = walletConnected && !!fid;

  return {
    fid,
    address,
    isConnected,
    isLoading: profileLoading,
  };
}