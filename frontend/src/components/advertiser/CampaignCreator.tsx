"use client";

import React, { useState } from "react";
import { useUser } from "@/hooks/useUser";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { API_BASE, cn } from "@/lib/utils";

export function CampaignCreator() {
  const { fid } = useUser();
  const [creativeUrl, setCreativeUrl] = useState("");
  const [budget, setBudget] = useState("");
  const [targeting, setTargeting] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fid) return;
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch(`${API_BASE}/api/advertiser/campaign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          advertiserFid: fid,
          creativeUrl,
          budget,
          targeting: targeting ? JSON.parse(targeting) : {},
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to create campaign");
      setMessage("Campaign created successfully!");
      setCreativeUrl("");
      setBudget("");
      setTargeting("");
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Create Campaign</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="creativeUrl"
          label="Creative URL"
          placeholder="https://example.com/ad.png"
          value={creativeUrl}
          onChange={(e) => setCreativeUrl(e.target.value)}
          required
        />
        <Input
          id="budget"
          label="Budget (ETH)"
          type="number"
          step="0.001"
          placeholder="1.0"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          required
        />
        <Input
          id="targeting"
          label="Targeting (JSON)"
          placeholder='{"followers":1000}'
          value={targeting}
          onChange={(e) => setTargeting(e.target.value)}
        />
        <Button type="submit" isLoading={loading} className="w-full">
          Create Campaign
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