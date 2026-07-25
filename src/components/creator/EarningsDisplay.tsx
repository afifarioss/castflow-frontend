"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/hooks/useUser";
import { Card } from "@/components/ui/Card";
import { API_BASE } from "@/lib/utils";

export function EarningsDisplay() {
  const { address } = useUser();
  const [total, setTotal] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!address) return;
    setLoading(true);
    setError(null);
    fetch(`${API_BASE}/api/creator/earnings/address/${address}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch earnings");
        return res.json();
      })
      .then((data) => setTotal(data.totalEarningsEth ?? "0"))
      .catch(() => setError("Error loading earnings"))
      .finally(() => setLoading(false));
  }, [address]);

  if (!address) return <Card><p className="text-text-secondary">Connect your wallet to view earnings</p></Card>;
  if (loading) return <Card><p className="text-text-secondary">Loading earnings...</p></Card>;
  if (error) return <Card><p className="text-red-400">{error}</p></Card>;

  return (
    <Card>
      <h2 className="text-xl font-bold mb-4">Earnings</h2>
      <div className="text-3xl font-bold text-accent">{total} ETH</div>
    </Card>
  );
}
