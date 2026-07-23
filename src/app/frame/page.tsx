'use client'

import { useState } from 'react'
import { WatchlistProvider, useWatchlist } from '@/hooks/useWatchlist'
import { WatchlistTab } from '@/components/WatchlistTab'
import { WatchlistButton } from '@/components/WatchlistButton'

const mockPortfolioTokens = [
  {
    address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
    symbol: 'USDT',
    name: 'Tether USD',
    balance: '1000.00',
    usdValue: '1000.00',
    change24h: '+0.1%',
  },
  {
    address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    symbol: 'WETH',
    name: 'Wrapped Ether',
    balance: '5.50',
    usdValue: '10230.00',
    change24h: '+2.4%',
  },
  {
    address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    symbol: 'USDC',
    name: 'USD Coin',
    balance: '3000.00',
    usdValue: '3000.00',
    change24h: '+0.0%',
  },
]

function FrameContent() {
  const [activeTab, setActiveTab] = useState<'portfolio' | 'watchlist'>('portfolio')
  const { count } = useWatchlist()

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <h1 className="text-2xl font-bold mb-6">CastFlow Portfolio</h1>

      <div className="flex gap-4 mb-6 border-b border-gray-700">
        <button
          onClick={() => setActiveTab('portfolio')}
          className={`pb-3 px-2 font-medium transition-colors ${
            activeTab === 'portfolio'
              ? 'text-blue-400 border-b-2 border-blue-400'
              : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          Portfolio ({mockPortfolioTokens.length})
        </button>
        <button
          onClick={() => setActiveTab('watchlist')}
          className={`pb-3 px-2 font-medium transition-colors ${
            activeTab === 'watchlist'
              ? 'text-blue-400 border-b-2 border-blue-400'
              : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          ★ Watchlist ({count})
        </button>
      </div>

      {activeTab === 'portfolio' ? (
        <div className="space-y-2">
          {mockPortfolioTokens.map((token) => (
            <div
              key={token.address}
              className="flex items-center justify-between p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition"
            >
              <div className="flex-1">
                <p className="font-medium">{token.symbol}</p>
                <p className="text-xs text-gray-400">{token.name}</p>
              </div>
              <div className="text-right mr-3">
                <p className="font-semibold">${token.usdValue}</p>
                <p
                  className={`text-xs ${
                    token.change24h.includes('-') ? 'text-red-400' : 'text-green-400'
                  }`}
                >
                  {token.change24h}
                </p>
              </div>
              <WatchlistButton token={token} />
            </div>
          ))}
        </div>
      ) : (
        <WatchlistTab allTokens={mockPortfolioTokens} />
      )}
    </div>
  )
}

export default function FramePage() {
  return (
    <WatchlistProvider>
      <FrameContent />
    </WatchlistProvider>
  )
}
