"use client";

import React, { useState } from "react";
import { useUser } from "@/hooks/useUser";
import { ConnectWallet } from "@/components/shared/ConnectWallet";
import { CampaignCreator } from "@/components/advertiser/CampaignCreator";
import { BidInterface } from "@/components/advertiser/BidInterface";
import { Button } from "@/components/ui/Button";

export default function AdvertiserDashboard() {
  const { isConnected, isLoading } = useUser();
  const [activeTab, setActiveTab] = useState<"campaign" | "bid">("campaign");

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-text-secondary">Loading...</div>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-6">
        <h1 className="text-2xl font-bold">Advertiser Dashboard</h1>
        <p className="text-text-secondary">Sign in to create campaigns and bid</p>
        <ConnectWallet />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Advertiser Dashboard</h1>
      <div className="flex gap-4 mb-8">
        <Button
          variant={activeTab === "campaign" ? "primary" : "secondary"}
          onClick={() => setActiveTab("campaign")}
        >
          Create Campaign
        </Button>
        <Button
          variant={activeTab === "bid" ? "primary" : "secondary"}
          onClick={() => setActiveTab("bid")}
        >
          Place Bid
        </Button>
      </div>
      {activeTab === "campaign" ? <CampaignCreator /> : <BidInterface />}
    </div>
  );
}