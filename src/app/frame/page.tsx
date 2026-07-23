'use client'

import { useState, useCallback } from 'react'
import { WatchlistProvider, useWatchlist } from '@/hooks/useWatchlist'
import { WatchlistTab } from '@/components/WatchlistTab'
import { WatchlistButton } from '@/components/WatchlistButton'

interface PortfolioToken {
  address: string
  symbol: string
  name: string
  balance: string
  logo?: string | null
  usdValue?: string
  change24h?: string
}

function FrameContent() {
  const [activeTab, setActiveTab] = useState<'portfolio' | 'watchlist'>('portfolio')
  const [addressInput, setAddressInput] = useState('')
  const [tokens, setTokens] = useState<PortfolioToken[]>([])
  const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'loaded'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const { count } = useWatchlist()

  const fetchPortfolio = useCallback(async (address: string) => {
    if (!address) return
    setStatus('loading')
    setErrorMsg('')
    try {
      const res = await fetch(`/api/portfolio?address=${address}`)
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Failed to load portfolio')
      }
      setTokens(data.tokens || [])
      setStatus('loaded')
    } catch (err) {
      setStatus('error')
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong')
    }
  }, [])

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <h1 className="text-2xl font-bold mb-4">CastFlow Portfolio</h1>

      {/* Wallet address input */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={addressInput}
          onChange={(e) => setAddressInput(e.target.value)}
          placeholder="0x wallet address"
          className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500"
        />
        <button
          onClick={() => fetchPortfolio(addressInput)}
          disabled={status === 'loading'}
          className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 px-4 py-2 rounded-lg text-sm font-medium"
        >
          {status === 'loading' ? 'Loading...' : 'View'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-gray-700">
        <button
          onClick={() => setActiveTab('portfolio')}
          className={`pb-3 px-2 font-medium transition-colors ${
            activeTab === 'portfolio'
              ? 'text-blue-400 border-b-2 border-blue-400'
              : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          Portfolio ({tokens.length})
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

      {/* Tab Content */}
      {activeTab === 'portfolio' ? (
        <>
          {status === 'idle' && (
            <p className="text-center text-gray-500 py-8 text-sm">
              Enter a wallet address to view its Base portfolio.
            </p>
          )}
          {status === 'loading' && (
            <p className="text-center text-gray-500 py-8 text-sm">Loading portfolio...</p>
          )}
          {status === 'error' && (
            <div className="text-center py-8">
              <p className="text-red-400 text-sm mb-2">{errorMsg}</p>
              <button
                onClick={() => fetchPortfolio(addressInput)}
                className="text-blue-400 text-sm underline"
              >
                Retry
              </button>
            </div>
          )}
          {status === 'loaded' && tokens.length === 0 && (
            <p className="text-center text-gray-500 py-8 text-sm">No tokens found for this address.</p>
          )}
          {status === 'loaded' && tokens.length > 0 && (
            <div className="space-y-2">
              {tokens.map((token) => (
                <div
                  key={token.address}
                  className="flex items-center justify-between p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition"
                >
                  <div className="flex-1">
                    <p className="font-medium">{token.symbol}</p>
                    <p className="text-xs text-gray-400">{token.name}</p>
                  </div>
                  <div className="text-right mr-3">
                    <p className="font-semibold">{token.balance}</p>
                  </div>
                  <WatchlistButton token={token} />
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <WatchlistTab allTokens={tokens} />
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
