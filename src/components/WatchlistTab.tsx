'use client'

import { useWatchlist } from '@/hooks/useWatchlist'
import { WatchlistButton } from './WatchlistButton'

interface TokenWithPrice {
  address: string
  symbol: string
  name: string
  balance: string
  usdValue?: string
  change24h?: string
  logo?: string
}

interface WatchlistTabProps {
  allTokens: TokenWithPrice[]
}

export function WatchlistTab({ allTokens }: WatchlistTabProps) {
  const { watchlist, loading } = useWatchlist()

  if (loading) {
    return <div className="p-4 text-center text-gray-500">Loading watchlist...</div>
  }

  if (watchlist.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        <p className="text-sm">No tokens in your watchlist yet.</p>
        <p className="text-xs mt-2">Star tokens to track them here.</p>
      </div>
    )
  }

  const watchlistedTokens = allTokens.filter((token) =>
    watchlist.some((w) => w.address.toLowerCase() === token.address.toLowerCase())
  )

  return (
    <div className="space-y-2 p-4">
      {watchlistedTokens.map((token) => (
        <div
          key={token.address}
          className="flex items-center justify-between p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition"
        >
          <div className="flex-1">
            <p className="font-medium text-white">
              {token.symbol}
              <span className="text-xs text-gray-400 ml-2">{token.name}</span>
            </p>
            <p className="text-sm text-gray-400">{token.balance}</p>
          </div>

          <div className="text-right mr-3">
            {token.usdValue && (
              <p className="font-semibold text-white">${token.usdValue}</p>
            )}
            {token.change24h && (
              <p
                className={`text-xs ${
                  parseFloat(token.change24h) >= 0
                    ? 'text-green-400'
                    : 'text-red-400'
                }`}
              >
                {token.change24h}
              </p>
            )}
          </div>

          <WatchlistButton token={token} />
        </div>
      ))}
    </div>
  )
}
