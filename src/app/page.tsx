import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { SupportButton } from "@/components/SupportButton";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-6">
      <div className="max-w-2xl w-full space-y-16 py-12">
        {/* Hero — the value prop, answerable in 5 seconds */}
        <div className="text-center space-y-5">
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-primary via-purple to-accent bg-clip-text text-transparent leading-tight">
            Turn your casts into income
          </h1>
          <p className="text-xl text-text-secondary max-w-xl mx-auto">
            CastFlow connects Farcaster creators with advertisers.
            Payments settle instantly on Base — no middlemen, no platform fees.
          </p>
          <div className="flex gap-4 justify-center flex-wrap pt-2">
            <Link href="/creator">
              <Button variant="primary" size="lg">
                I&apos;m a Creator
              </Button>
            </Link>
            <Link href="/advertiser">
              <Button variant="accent" size="lg">
                I&apos;m an Advertiser
              </Button>
            </Link>
            <Link href="/frame">
              <Button variant="secondary" size="lg">
                View Portfolio Tracker
              </Button>
            </Link>
          </div>
        </div>

        {/* How it works — quick, concrete, answers "why is this useful" */}
        <div>
          <h2 className="text-lg font-semibold text-primary mb-4 text-center">
            How it works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-black/20 rounded-xl p-5 text-center">
              <div className="text-2xl mb-2">📢</div>
              <p className="text-sm text-text-secondary">
                Creators list cast sponsorship slots
              </p>
            </div>
            <div className="bg-black/20 rounded-xl p-5 text-center">
              <div className="text-2xl mb-2">🤝</div>
              <p className="text-sm text-text-secondary">
                Advertisers book a campaign
              </p>
            </div>
            <div className="bg-black/20 rounded-xl p-5 text-center">
              <div className="text-2xl mb-2">⚡</div>
              <p className="text-sm text-text-secondary">
                Payment settles on Base, automatically
              </p>
            </div>
          </div>
        </div>

        {/* Why Base — short trust signal, not a wall of text */}
        <div className="bg-black/20 rounded-xl p-6 text-center">
          <p className="text-sm text-text-secondary">
            <span className="text-primary font-semibold">Why Base:</span> low
            fees, fast settlement, and a protocol built for Farcaster-native
            audiences.
          </p>
        </div>

        {/* Repeat the primary CTA once desire is built */}
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/creator">
            <Button variant="primary" size="lg">
              Explore Creator Dashboard
            </Button>
          </Link>
          <Link href="/advertiser">
            <Button variant="accent" size="lg">
              Explore Advertiser Dashboard
            </Button>
          </Link>
        </div>

        {/* Story — trust-building, comes after the value prop is established */}
        <div className="text-left bg-black/20 rounded-xl p-6">
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
          </div>
        </div>

        {/* Support — last, low-pressure, clearly optional */}
        <div className="text-center space-y-3">
          <p className="text-sm text-text-secondary">
            Found this useful? You can support the builders directly.
          </p>
          <SupportButton />
        </div>
      </div>
    </main>
  );
}
