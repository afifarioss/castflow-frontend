import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function AdvertiserPage() {
  const waitlistCastText =
    "Interested in the CastFlow advertiser waitlist — want to reach Farcaster-native audiences on Base 🌊";

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="max-w-2xl text-center space-y-8">
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
            <li>Creators list cast sponsorship slots</li>
            <li>You book a campaign</li>
            <li>Payment settles on Base, automatically</li>
          </ol>
        </div>

        <div className="text-left bg-black/20 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-accent mb-2">Example campaign</h2>
          <p className="text-text-secondary text-sm">
            50 USDC for one sponsored cast from a Base creator.
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
