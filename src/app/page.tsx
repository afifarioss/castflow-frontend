import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { SupportButton } from "@/components/SupportButton";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="max-w-2xl w-full text-center space-y-8">
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
        <div className="pt-4 text-text-secondary text-sm">
          Built on <span className="text-primary font-semibold">Base</span> &{" "}
          <span className="text-purple font-semibold">Farcaster</span>
        </div>

        {/* The CastFlow Story */}
        <div className="text-left bg-black/20 rounded-xl p-6 max-w-md mx-auto">
          <h2 className="text-lg font-semibold text-primary mb-3">
            📖 The CastFlow Story
          </h2>
          <div className="space-y-3 text-sm text-text-secondary">
            <p>We built CastFlow because we wanted to earn from our casts.</p>
            <p>
              We&apos;re a small team of builders who spend our days on Farcaster.
              We saw creators putting out great content — alpha threads, NFT
              insights, Base ecosystem updates — and getting nothing in return
              but likes and reposts.
            </p>
            <p>
              We built five Solidity contracts, deployed them on Base Sepolia,
              and pivoted from a portfolio tracker to what CastFlow is today: a
              decentralized ad protocol for Farcaster.
            </p>
            <p>
              We&apos;re not a company. We&apos;re a team of builders shipping in
              public — proving that creators can earn onchain without leaving
              their feed.
            </p>
            <p className="text-primary font-medium">
              No middlemen. No platform fees. Just you, your audience, and Base.
            </p>
          </div>
        </div>

        {/* Support CastFlow */}
        <SupportButton />
      </div>
    </main>
  );
}
