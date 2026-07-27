export function TrustSection() {
  return (
    <div className="bg-black/20 rounded-xl p-6 space-y-4">
      <h2 className="text-lg font-semibold text-primary">🔒 Trust & Safety</h2>
      <div className="grid sm:grid-cols-2 gap-4 text-sm text-text-secondary">
        <div>
          <p className="font-medium text-white mb-1">For advertisers</p>
          <ul className="space-y-1 list-disc list-inside">
            <li>You see the creator's price and description before booking</li>
            <li>Payment is manual during beta — you settle directly with the creator</li>
          </ul>
        </div>
        <div>
          <p className="font-medium text-white mb-1">For creators</p>
          <ul className="space-y-1 list-disc list-inside">
            <li>You control what you post — no one can post on your behalf</li>
            <li>You see the campaign brief before agreeing to post</li>
          </ul>
        </div>
      </div>
      <p className="text-xs text-text-secondary pt-2 border-t border-white/10">
        There's no automated escrow or dispute resolution yet — this is a beta,
        and settlement is currently between the two parties directly. On-chain
        escrow is on the roadmap.
      </p>
    </div>
  );
}
