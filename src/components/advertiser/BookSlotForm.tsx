"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/hooks/useUser";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { API_BASE, cn } from "@/lib/utils";

interface OpenSlot {
  id: string;
  castHash: string;
  priceEth: string;
  durationSeconds: number;
  metadata: string;
  creator: { username: string };
}

export function BookSlotForm() {
  const { address } = useUser();
  const [slots, setSlots] = useState<OpenSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(true);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [campaignBrief, setCampaignBrief] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch(`${API_BASE}/api/advertiser/slots/open`)
      .then((res) => res.json())
      .then((data) => setSlots(data.slots || []))
      .catch(() => setMessage("Error: Failed to load open slots"))
      .finally(() => setLoadingSlots(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address || !selectedSlotId) return;
    setSubmitting(true);
    setMessage("");
    try {
      const response = await fetch(`${API_BASE}/api/advertiser/booking`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          walletAddress: address,
          slotId: selectedSlotId,
          campaignBrief,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Booking failed");

      setMessage("Slot booked! Payment happens off-chain during beta.");
      setSelectedSlotId(null);
      setCampaignBrief("");
      setSlots((prev) => prev.filter((s) => s.id !== selectedSlotId));
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingSlots) {
    return <Card><p className="text-text-secondary">Loading open slots...</p></Card>;
  }

  if (!selectedSlotId) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Open Slots</h2>
        {slots.length === 0 && <p className="text-text-secondary">No open slots right now.</p>}
        {slots.map((slot) => (
          <Card key={slot.id} className="flex items-center justify-between">
            <div>
              <p className="font-medium">{slot.creator?.username ?? "Unknown creator"}</p>
              <p className="text-sm text-text-secondary">{slot.metadata}</p>
              <p className="text-sm font-mono mt-1">{slot.priceEth} ETH</p>
            </div>
            <Button variant="accent" onClick={() => setSelectedSlotId(slot.id)}>
              Book
            </Button>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <Card className="max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Book Slot</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="campaignBrief"
          label="Campaign Brief"
          placeholder="What should this cast promote?"
          value={campaignBrief}
          onChange={(e) => setCampaignBrief(e.target.value)}
          required
        />
        <div className="flex gap-3">
          <Button type="button" variant="secondary" onClick={() => setSelectedSlotId(null)}>
            Back
          </Button>
          <Button type="submit" isLoading={submitting} className="flex-1">
            Confirm Booking
          </Button>
        </div>
      </form>
      {message && (
        <p className={cn("mt-3 text-sm", message.startsWith("Error") ? "text-red-400" : "text-accent")}>
          {message}
        </p>
      )}
    </Card>
  );
}
