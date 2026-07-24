import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function CreatorPage() {
  const waitlistCastText =
    "Interested in the CastFlow creator waitlist — want to earn from sponsored casts on Base 🌊";

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="max-w-2xl text-center space-y-8">
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
            <li>List a cast sponsorship slot</li>
            <li>Advertisers book your slot</li>
            <li>Payment settles on Base, automatically</li>
          </ol>
        </div>

        <div className="text-left bg-black/20 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-accent mb-2">Example listing</h2>
          <p className="text-text-secondary text-sm">
            50 USDC for one sponsored cast from a Base creator.
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
