"use client";

import { useEffect, useState } from "react";

export function useUser() {
  const [address, setAddress] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const eth = (window as any).ethereum;
    if (!eth) {
      setIsLoading(false);
      return;
    }
    eth.request({ method: "eth_accounts" }).then((accounts: string[]) => {
      setAddress(accounts?.[0] ?? null);
      setIsLoading(false);
    });
    const onAccountsChanged = (accounts: string[]) => setAddress(accounts?.[0] ?? null);
    eth.on?.("accountsChanged", onAccountsChanged);
    return () => eth.removeListener?.("accountsChanged", onAccountsChanged);
  }, []);

  return {
    // fid is null until real Farcaster login is wired up — do not assume it's set.
    fid: null as number | null,
    address,
    isConnected: !!address,
    isLoading,
  };
}
