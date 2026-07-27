const EXAMPLES = [
  { creator: '@base_builder', audience: 'Farcaster / Base / NFTs', price: '0.05 ETH', deliverable: '1 cast' },
  { creator: '@degen_alpha', audience: 'Farcaster / DeFi / Base', price: '0.03 ETH', deliverable: '1 cast + engagement' },
  { creator: '@nft_artist', audience: 'Farcaster / NFTs / Art', price: '0.08 ETH', deliverable: '1 cast + visual asset' },
];

export function SampleSlots() {
  return (
    <div className="space-y-3">
      <p className="text-xs text-text-secondary uppercase tracking-wide">
        Example listings — illustrative, not live bookings
      </p>
      <div className="grid sm:grid-cols-3 gap-3">
        {EXAMPLES.map((ex) => (
          <div key={ex.creator} className="bg-black/20 rounded-xl p-4 text-sm">
            <p className="font-medium text-white">{ex.creator}</p>
            <p className="text-text-secondary text-xs mt-1">{ex.audience}</p>
            <p className="text-accent font-semibold mt-2">{ex.price}</p>
            <p className="text-text-secondary text-xs">{ex.deliverable}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
