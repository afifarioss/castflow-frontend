"use client";

import React, { useState } from "react";
import { useUser } from "@/hooks/useUser";
import { useContract } from "@/hooks/useContract";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { API_BASE, cn } from "@/lib/utils";

export function SlotManager() {
  const { fid } = useUser();
  const { createAdSlot } = useContract();
  const [castHash, setCastHash] = useState("");
  const [reservePrice, setReservePrice] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fid) return;
    setLoading(true);
    setMessage("");
    try {
      // Call backend to register slot (off-chain storage)
      const response = await fetch(`${API_BASE}/api/creator/slot`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fid,
          castHash,
          reservePrice,
          expiresAt: Math.floor(new Date(expiresAt).getTime() / 1000),
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to create slot");

      // Optionally trigger onchain transaction
      await createAdSlot(
        fid,
        castHash,
        reservePrice,
        Math.floor(new Date(expiresAt).getTime() / 1000)
      );

      setMessage("Ad slot created successfully!");
      setCastHash("");
      setReservePrice("");
      setExpiresAt("");
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Create Ad Slot</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="castHash"
          label="Cast Hash"
          placeholder="0x..."
          value={castHash}
          onChange={(e) => setCastHash(e.target.value)}
          required
        />
        <Input
          id="reservePrice"
          label="Reserve Price (ETH)"
          type="number"
          step="0.001"
          placeholder="0.01"
          value={reservePrice}
          onChange={(e) => setReservePrice(e.target.value)}
          required
        />
        <Input
          id="expiresAt"
          label="Expiration Date"
          type="datetime-local"
          value={expiresAt}
          onChange={(e) => setExpiresAt(e.target.value)}
          required
        />
        <Button type="submit" isLoading={loading} className="w-full">
          Create Slot
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