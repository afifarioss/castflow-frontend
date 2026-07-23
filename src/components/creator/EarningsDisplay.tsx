"use client";

import React from "react";
import { useUser } from "@/hooks/useUser";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/Card";
import { API_BASE } from "@/lib/utils";

interface Earning {
  id: string;
  amount: string;
  slotId: string;
  timestamp: string;
}

export function EarningsDisplay() {
  const { fid } = useUser();

  const { data, isLoading, error } = useQuery<{ total: string; history: Earning[] }>({
    queryKey: ["creator-earnings", fid],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/api/creator/earnings/${fid}`);
      if (!res.ok) throw new Error("Failed to fetch earnings");
      return res.json();
    },
    enabled: !!fid,
  });

  if (isLoading) return <div className="text-text-secondary">Loading earnings...</div>;
  if (error) return <div className="text-red-400">Error loading earnings</div>;

  return (
    <Card>
      <h2 className="text-xl font-bold mb-4">Earnings</h2>
      {data ? (
        <>
          <div className="text-3xl font-bold text-accent mb-6">{data.total} ETH</div>
          {data.history.length > 0 ? (
            <ul className="space-y-3">
              {data.history.map((item) => (
                <li key={item.id} className="flex justify-between items-center border-b border-white/10 pb-2">
                  <span className="text-text-secondary text-sm">Slot {item.slotId}</span>
                  <span className="font-medium">{item.amount} ETH</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-text-secondary">No earnings yet</p>
          )}
        </>
      ) : (
        <p className="text-text-secondary">Connect and sign in to view earnings</p>
      )}
    </Card>
  );
}