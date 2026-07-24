import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { SupportButton } from "@/components/SupportButton";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-6">
      <div className="max-w-2xl w-full space-y-16 py-12">
        {/* Hero */}
        <div className="text-center space-y-5">
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-primary via-purple to-accent bg-clip-text text-transparent leading-tight">
            Turn your casts into income
          </h1>
          <p className="text-xl text-text-secondary max-w-xl mx-auto">
            CastFlow lets Farcaster creators list sponsored cast slots and lets
            advertisers book them directly. Payments settle on Base through
            transparent escrow.
          </p>
          <div className="flex gap-4 justify-center flex-wrap pt-2">
            <Link href="/creator">
              <Button variant="primary" size="lg">
                Earn from my casts
              </Button>
            </Link>
            <Link href="/advertiser">
              <Button variant="accent" size="lg">
                Book a creator
              </Button>
            </Link>
          </div>
          <p className="text-xs text-text-secondary pt-1">
            No platform fees during beta. Built on Base and Farcaster.
          </p>
        </div>

        {/* Sample campaign card */}
        <div className="bg-black/20 rounded-xl p-6 max-w-md mx-auto">
          <p className="text-xs text-text-secondary mb-3 uppercase tracking-wide">
            Example listing
          </p>
          <h2 className="text-lg font-semibold text-primary mb-3">
            Sponsored Cast Slot
          </h2>
          <dl className="space-y-1.5 text-sm">
            <div className="flex justify-between">
              <dt className="text-text-secondary">Creator</dt>
              <dd>Base Builder</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-text-secondary">Audience</dt>
              <dd>Farcaster / Base / NFTs</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-text-secondary">Price</dt>
              <dd className="text-accent font-semibold">50 USDC</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-text-secondary">Deliverable</dt>
              <dd>1 cast</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-text-secondary">Payment</dt>
              <dd>Base escrow</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-text-secondary">Status</dt>
              <dd className="text-green-400">Available</dd>
            </div>
          </dl>
        </div>

        {/* How it works — creators + advertisers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-black/20 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-primary mb-3">
              For creators
            </h2>
            <ol className="space-y-2 text-sm text-text-secondary list-decimal list-inside">
              <li>Set your price for a sponsored cast</li>
              <li>Advertisers book your slot</li>
              <li>You publish the cast</li>
              <li>You get paid on Base</li>
            </ol>
          </div>
          <div className="bg-black/20 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-accent mb-3">
              For advertisers
            </h2>
            <ol className="space-y-2 text-sm text-text-secondary list-decimal list-inside">
              <li>Choose a creator</li>
              <li>Submit your campaign brief</li>
              <li>Funds are held in escrow</li>
              <li>Payment releases after the cast is posted</li>
            </ol>
          </div>
        </div>

        {/* Why Base */}
        <div className="bg-black/20 rounded-xl p-6 text-center">
          <p className="text-sm text-text-secondary">
            <span className="text-primary font-semibold">Why Base:</span> low
            fees, fast settlement, and a protocol built for Farcaster-native
            audiences.
          </p>
        </div>

        {/* Repeat-use loops */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-black/20 rounded-xl p-5">
            <p className="text-xs text-primary font-semibold mb-2">
              Why creators come back
            </p>
            <p className="text-sm text-text-secondary">
              List slot → get booked → post cast → get paid → reputation
              increases → better campaigns
            </p>
          </div>
          <div className="bg-black/20 rounded-xl p-5">
            <p className="text-xs text-accent font-semibold mb-2">
              Why advertisers come back
            </p>
            <p className="text-sm text-text-secondary">
              Create campaign → book creator → track result → save best
              creators → relaunch
            </p>
          </div>
        </div>

        {/* Short story */}
        <div className="text-left bg-black/20 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-primary mb-3">
            📖 Why we built this
          </h2>
          <p className="text-sm text-text-secondary">
            We built CastFlow because Farcaster creators create real attention
            but rarely get paid for it. CastFlow lets creators list sponsored
            cast slots and lets advertisers book them directly, with payments
            settled on Base. Built by{" "}
            <a
              href="https://warpcast.com/afifarioss"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline"
            >
              @afifarioss
            </a>{" "}
            and shipped in public.
          </p>
        </div>

        {/* Support */}
        <div className="text-center space-y-3">
          <p className="text-sm text-text-secondary">
            No platform fees during beta. Support the builders with optional
            USDC tips.
          </p>
          <SupportButton />
        </div>

        {/* Footer */}
        <div className="text-center pt-4 border-t border-white/10">
          <Link
            href="/frame"
            className="text-xs text-gray-500 hover:text-gray-400"
          >
            Previous experiment: Portfolio Tracker
          </Link>
        </div>
      </div>
    </main>
  );
}
