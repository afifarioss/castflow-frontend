import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function CreatorPage() {
  const waitlistCastText =
    "Interested in the CastFlow creator waitlist — want to earn from sponsored casts on Base 🌊";

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="max-w-2xl w-full text-center space-y-8">
        <Link href="/" className="text-sm text-text-secondary hover:text-primary">
          ← CastFlow
        </Link>

        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-primary via-purple to-accent bg-clip-text text-transparent">
          Creator Dashboard
        </h1>
        <p className="text-xl text-text-secondary">
          Earn from sponsored casts without leaving Farcaster.
        </p>

        <div className="text-left space-y-4 bg-black/20 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-primary">How it works</h2>
          <ol className="space-y-2 text-text-secondary text-sm list-decimal list-inside">
            <li>Set your price for a sponsored cast</li>
            <li>Advertisers book your slot</li>
            <li>You publish the cast</li>
            <li>You get paid on Base</li>
          </ol>
        </div>

        {/* Mock dashboard — clearly labeled as example/demo data */}
        <div className="text-left bg-black/20 rounded-xl p-6">
          <p className="text-xs text-text-secondary mb-3 uppercase tracking-wide">
            Example data — dashboard not live yet
          </p>
          <h2 className="text-lg font-semibold text-accent mb-3">
            Your slots (demo)
          </h2>
          <div className="space-y-2">
            <div className="flex justify-between items-center bg-white/5 rounded-lg p-3 text-sm">
              <div>
                <p className="font-medium">Sponsored Cast Slot</p>
                <p className="text-text-secondary text-xs">50 USDC · 1 cast</p>
              </div>
              <span className="text-green-400 text-xs font-medium">Available</span>
            </div>
            <div className="flex justify-between items-center bg-white/5 rounded-lg p-3 text-sm">
              <div>
                <p className="font-medium">Sponsored Cast Slot</p>
                <p className="text-text-secondary text-xs">75 USDC · 1 cast + reply</p>
              </div>
              <span className="text-yellow-400 text-xs font-medium">Booked</span>
            </div>
            <div className="flex justify-between items-center bg-white/5 rounded-lg p-3 text-sm">
              <div>
                <p className="text-text-secondary">Total earnings (demo)</p>
              </div>
              <span className="text-primary font-semibold">125 USDC</span>
            </div>
          </div>
          <button
            disabled
            className="w-full mt-4 bg-white/5 text-text-secondary text-sm py-2 rounded-lg cursor-not-allowed"
          >
            List a slot (coming soon)
          </button>
        </div>

        <div className="text-left bg-black/20 rounded-xl p-5">
          <p className="text-xs text-primary font-semibold mb-2">
            Why creators come back
          </p>
          <p className="text-sm text-text-secondary">
            List slot → get booked → post cast → get paid → reputation
            increases → better campaigns
          </p>
        </div>

        <div className="pt-4 space-y-3">
          <p className="text-sm text-text-secondary">
            The creator dashboard itself is still in progress — the auction and
            escrow contracts are live on Base Sepolia, and the interface is next.
          </p>
          <a
            href={`https://warpcast.com/~/compose?text=${encodeURIComponent(waitlistCastText)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="primary" size="lg">
              Join the waitlist on Farcaster
            </Button>
          </a>
        </div>
      </div>
    </main>
  );
}
