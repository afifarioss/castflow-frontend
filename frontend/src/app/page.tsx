import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="max-w-2xl text-center space-y-8">
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-primary via-purple to-accent bg-clip-text text-transparent">
          CastFlow
        </h1>
        <p className="text-xl text-text-secondary">
          Decentralized Ad Protocol for Farcaster. Monetize your casts, discover
          brands, earn crypto.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/creator">
            <Button variant="primary" size="lg">
              Creator Dashboard
            </Button>
          </Link>
          <Link href="/advertiser">
            <Button variant="accent" size="lg">
              Advertiser Dashboard
            </Button>
          </Link>
        </div>
        <div className="pt-12 text-text-secondary text-sm">
          Built on <span className="text-primary font-semibold">Base</span> &{" "}
          <span className="text-purple font-semibold">Farcaster</span>
        </div>
      </div>
    </main>
  );
}