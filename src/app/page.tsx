import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ListSlotButton } from "@/components/ListSlotButton";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="max-w-md w-full space-y-6">
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border-subtle bg-surface px-3 py-1 font-mono text-xs text-text-secondary">
            <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
            Live on Base Sepolia
          </div>
        </div>

        <div className="text-center space-y-3">
          <h1 className="text-4xl font-bold tracking-tight text-white">
            CastFlow
          </h1>
          <p className="text-base text-text-secondary leading-relaxed">
            Decentralized Ad Protocol for Farcaster. Monetize your casts, discover
            brands, earn crypto.
          </p>
        </div>

        <div className="rounded-xl border border-border-subtle bg-surface p-4 flex flex-col sm:flex-row gap-3">
          <Link href="/creator" className="flex-1">
            <Button variant="primary" size="lg" className="w-full">
              Creator Dashboard
            </Button>
          </Link>
          <Link href="/advertiser" className="flex-1">
            <Button variant="accent" size="lg" className="w-full">
              Advertiser Dashboard
            </Button>
          </Link>
        </div>

        <div className="rounded-xl border border-border-subtle bg-surface p-4">
          <ListSlotButton />
        </div>

        <div className="text-center text-text-secondary text-xs font-mono pt-2">
          Built on <span className="text-primary">Base</span> &{" "}
          <span className="text-purple">Farcaster</span>
        </div>
      </div>
    </main>
  );
}
