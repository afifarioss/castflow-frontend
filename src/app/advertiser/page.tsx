"use client";

import { useUser } from "@/hooks/useUser";
import { ConnectWallet } from "@/components/shared/ConnectWallet";
import { BookSlotForm } from "@/components/advertiser/BookSlotForm";

export default function AdvertiserDashboard() {
  const { isConnected, isLoading } = useUser();

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
        <p className="text-text-secondary">Connect your wallet to browse and book ad slots</p>
        <ConnectWallet />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Advertiser Dashboard</h1>
      <BookSlotForm />
    </div>
  );
}
