"use client";

import React, { useState } from "react";
import { useUser } from "@/hooks/useUser";
import { useContract } from "@/hooks/useContract";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { API_BASE, cn } from "@/lib/utils";

export function BidInterface() {
  const { fid } = useUser();
  const { placeBid } = useContract();
  const [slotId, setSlotId] = useState("");
  const [bidAmount, setBidAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fid) return;
    setLoading(true);
    setMessage("");
    try {
      // Submit bid to backend
      const response = await fetch(`${API_BASE}/api/advertiser/bid`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fid,
          slotId: parseInt(slotId),
          bidAmount,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Bid failed");

      // Place bid on-chain
      await placeBid(parseInt(slotId), bidAmount);

      setMessage("Bid placed successfully!");
      setSlotId("");
      setBidAmount("");
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Place Bid</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="slotId"
          label="Slot ID"
          type="number"
          placeholder="42"
          value={slotId}
          onChange={(e) => setSlotId(e.target.value)}
          required
        />
        <Input
          id="bidAmount"
          label="Bid Amount (ETH)"
          type="number"
          step="0.001"
          placeholder="0.05"
          value={bidAmount}
          onChange={(e) => setBidAmount(e.target.value)}
          required
        />
        <Button type="submit" isLoading={loading} className="w-full">
          Place Bid
        </Button>
      </form>
      {message && (
        <p className={cn("mt-3 text-sm", message.startsWith("Error") ? "text-red-400" : "text-accent")}>
          {message}
        </p>
      )}
    </Card>
  );
}