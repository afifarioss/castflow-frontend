import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ListSlotButton } from "@/components/ListSlotButton";
import { SupportButton } from "@/components/SupportButton";
import { TrustSection } from "@/components/TrustSection";
import { SampleSlots } from "@/components/SampleSlots";
import { SocialProof } from "@/components/SocialProof";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-6">
      <div className="max-w-2xl w-full space-y-16 py-12">
        {/* Hero */}
        <div className="text-center space-y-5">
          <div className="flex justify-center mb-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-border-subtle bg-surface px-3 py-1 font-mono text-xs text-text-secondary">
              <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
              Live on Base Sepolia
            </div>
          </div>
          <p className="text-sm text-text-secondary uppercase tracking-wide">
            CastFlow — The Farcaster Ad Marketplace
          </p>
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-primary via-purple to-accent bg-clip-text text-transparent leading-tight">
            Turn your casts into income
          </h1>
          <p className="text-xl text-text-secondary max-w-xl mx-auto">
            CastFlow lets Farcaster creators list sponsored cast slots and lets
            advertisers book them directly. Payments settle on Base in ETH.
          </p>
          <p className="text-sm text-text-secondary font-mono">
            List → Advertiser books → Creator posts → Settle in ETH → Cast stays live
          </p>
          <div className="flex gap-4 justify-center flex-wrap pt-2">
            <Link href="/creator">
              <Button variant="primary" size="lg">Earn from my casts</Button>
            </Link>
            <Link href="/advertiser">
              <Button variant="accent" size="lg">Book a creator</Button>
            </Link>
          </div>
          <p className="text-xs text-text-secondary pt-1">
            No platform fees during beta. Built on Base and Farcaster.
          </p>
        </div>

        <SocialProof />

        {/* List a slot — the real, working action */}
        <div className="rounded-xl border border-border-subtle bg-surface p-4 max-w-md mx-auto">
          <ListSlotButton />
        </div>

        <SampleSlots />

        <TrustSection />

        {/* How it works */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-black/20 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-primary mb-3">For creators</h2>
            <ol className="space-y-2 text-sm text-text-secondary list-decimal list-inside">
              <li>Set your price for a sponsored cast</li>
              <li>Advertisers book your slot</li>
              <li>You publish the cast</li>
              <li>You get paid in ETH on Base</li>
            </ol>
          </div>
          <div className="bg-black/20 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-accent mb-3">For advertisers</h2>
            <ol className="space-y-2 text-sm text-text-secondary list-decimal list-inside">
              <li>Browse open slots</li>
              <li>Submit your campaign brief</li>
              <li>Book at the listed price</li>
              <li>Cast goes live</li>
            </ol>
          </div>
        </div>

        <div className="bg-black/20 rounded-xl p-6 text-center">
          <p className="text-sm text-text-secondary">
            <span className="text-primary font-semibold">Why Base:</span> low
            fees, fast settlement, and a protocol built for Farcaster-native audiences.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-black/20 rounded-xl p-5">
            <p className="text-xs text-primary font-semibold mb-2">Why creators come back</p>
            <p className="text-sm text-text-secondary">
              List slot → get booked → post cast → get paid → reputation increases → better campaigns
            </p>
          </div>
          <div className="bg-black/20 rounded-xl p-5">
            <p className="text-xs text-accent font-semibold mb-2">Why advertisers come back</p>
            <p className="text-sm text-text-secondary">
              Book creator → track result → save best creators → relaunch
            </p>
          </div>
        </div>

        <div className="text-left bg-black/20 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-primary mb-3">📖 Why we built this</h2>
          <p className="text-sm text-text-secondary">
            We built CastFlow because Farcaster creators create real attention
            but rarely get paid for it. CastFlow lets creators list sponsored
            cast slots and lets advertisers book them directly, with payments
            settled on Base. Built by{" "}
            <a href="https://warpcast.com/afifarioss" target="_blank" rel="noopener noreferrer" className="text-primary underline">
              @afifarioss
            </a>{" "}
            and shipped in public.
          </p>
        </div>

        <div className="text-center space-y-3">
          <p className="text-sm text-text-secondary">
            No platform fees during beta. Support the builder with an optional tip.
          </p>
          <SupportButton />
        </div>

        <div className="text-center pt-4 border-t border-white/10">
          <Link href="/frame" className="text-xs text-gray-500 hover:text-gray-400">
            Previous experiment: Portfolio Tracker
          </Link>
        </div>
      </div>
    </main>
  );
}
