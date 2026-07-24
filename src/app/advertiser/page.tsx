import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function AdvertiserPage() {
  const waitlistCastText =
    "Interested in the CastFlow advertiser waitlist — want to reach Farcaster-native audiences on Base 🌊";

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="max-w-2xl w-full text-center space-y-8">
        <Link href="/" className="text-sm text-text-secondary hover:text-primary">
          ← CastFlow
        </Link>

        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-primary via-purple to-accent bg-clip-text text-transparent">
          Advertiser Dashboard
        </h1>
        <p className="text-xl text-text-secondary">
          Reach Farcaster-native audiences through trusted creators.
        </p>

        <div className="text-left space-y-4 bg-black/20 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-primary">How it works</h2>
          <ol className="space-y-2 text-text-secondary text-sm list-decimal list-inside">
            <li>Choose a creator</li>
            <li>Submit your campaign brief</li>
            <li>Funds are held in escrow</li>
            <li>Payment releases after the cast is posted</li>
          </ol>
        </div>

        {/* Mock dashboard — clearly labeled as example/demo data */}
        <div className="text-left bg-black/20 rounded-xl p-6">
          <p className="text-xs text-text-secondary mb-3 uppercase tracking-wide">
            Example data — dashboard not live yet
          </p>
          <h2 className="text-lg font-semibold text-accent mb-3">
            Your campaign (demo)
          </h2>
          <dl className="space-y-1.5 text-sm">
            <div className="flex justify-between">
              <dt className="text-text-secondary">Campaign</dt>
              <dd>Promote Base mini app</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-text-secondary">Budget</dt>
              <dd>100 USDC</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-text-secondary">Creator slot</dt>
              <dd>50 USDC</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-text-secondary">Deliverable</dt>
              <dd>1 cast</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-text-secondary">Status</dt>
              <dd className="text-yellow-400">Awaiting creator approval</dd>
            </div>
          </dl>
          <button
            disabled
            className="w-full mt-4 bg-white/5 text-text-secondary text-sm py-2 rounded-lg cursor-not-allowed"
          >
            Start a campaign (coming soon)
          </button>
        </div>

        <div className="text-left bg-black/20 rounded-xl p-5">
          <p className="text-xs text-accent font-semibold mb-2">
            Why advertisers come back
          </p>
          <p className="text-sm text-text-secondary">
            Create campaign → book creator → track result → save best
            creators → relaunch
          </p>
        </div>

        <div className="text-left bg-black/20 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-primary mb-2">Why Base</h2>
          <p className="text-text-secondary text-sm">
            Low fees, fast settlement, and a protocol built for Farcaster-native audiences.
          </p>
        </div>

        <div className="pt-4 space-y-3">
          <p className="text-sm text-text-secondary">
            The advertiser dashboard itself is still in progress — the auction and
            escrow contracts are live on Base Sepolia, and the interface is next.
          </p>
          <a
            href={`https://warpcast.com/~/compose?text=${encodeURIComponent(waitlistCastText)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="accent" size="lg">
              Join the waitlist on Farcaster
            </Button>
          </a>
        </div>
      </div>
    </main>
  );
}
