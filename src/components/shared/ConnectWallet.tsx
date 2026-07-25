"use client";

import { useUser } from "@/hooks/useUser";
import { Button } from "@/components/ui/Button";

function truncate(addr: string) {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export function ConnectWallet() {
  const { address, isLoading } = useUser();

  const connect = async () => {
    const eth = (window as any).ethereum;
    if (!eth) {
      alert("No wallet found. Open this page in a wallet browser or install a wallet extension.");
      return;
    }
    try {
      await eth.request({ method: "eth_requestAccounts" });
    } catch {
      // user rejected — no-op
    }
  };

  if (isLoading) {
    return <Button variant="secondary" disabled>Loading...</Button>;
  }

  if (!address) {
    return <Button onClick={connect} variant="primary">Connect Wallet</Button>;
  }

  return (
    <Button variant="secondary" size="sm">
      {truncate(address)}
    </Button>
  );
}
