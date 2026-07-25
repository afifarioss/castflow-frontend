"use client";

import { useState } from "react";
import { useUser } from "@/hooks/useUser";
import { ConnectWallet } from "@/components/shared/ConnectWallet";
import { ListSlotButton } from "@/components/ListSlotButton";
import { EarningsDisplay } from "@/components/creator/EarningsDisplay";
import { Button } from "@/components/ui/Button";

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
        <p className="text-text-secondary">Connect your wallet to manage your ad slots</p>
        <ConnectWallet />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Creator Dashboard</h1>
      <div className="flex gap-4 mb-8">
        <Button variant={activeTab === "slots" ? "primary" : "secondary"} onClick={() => setActiveTab("slots")}>
          List a Slot
        </Button>
        <Button variant={activeTab === "earnings" ? "primary" : "secondary"} onClick={() => setActiveTab("earnings")}>
          Earnings
        </Button>
      </div>
      {activeTab === "slots" ? <ListSlotButton /> : <EarningsDisplay />}
    </div>
  );
}
