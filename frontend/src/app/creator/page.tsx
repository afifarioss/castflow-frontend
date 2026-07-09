"use client";

import React, { useState } from "react";
import { useUser } from "@/hooks/useUser";
import { ConnectWallet } from "@/components/shared/ConnectWallet";
import { SlotManager } from "@/components/creator/SlotManager";
import { EarningsDisplay } from "@/components/creator/EarningsDisplay";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export default function CreatorDashboard() {
  const { isConnected, isLoading } = useUser();
  const [activeTab, setActiveTab] = useState<"slots" | "earnings">("slots");

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
        <h1 className="text-2xl font-bold">Creator Dashboard</h1>
        <p className="text-text-secondary">Sign in to manage your ad slots</p>
        <ConnectWallet />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Creator Dashboard</h1>
      <div className="flex gap-4 mb-8">
        <Button
          variant={activeTab === "slots" ? "primary" : "secondary"}
          onClick={() => setActiveTab("slots")}
        >
          My Slots
        </Button>
        <Button
          variant={activeTab === "earnings" ? "primary" : "secondary"}
          onClick={() => setActiveTab("earnings")}
        >
          Earnings
        </Button>
      </div>
      {activeTab === "slots" ? <SlotManager /> : <EarningsDisplay />}
    </div>
  );
}