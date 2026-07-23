'use client'

import { useState, useCallback, useEffect } from 'react'
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
}

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>
      on?: (event: string, handler: (...args: unknown[]) => void) => void
      removeListener?: (event: string, handler: (...args: unknown[]) => void) => void
    }
  }
}

function FrameContent() {
  const [activeTab, setActiveTab] = useState<'portfolio' | 'watchlist'>('portfolio')
  const [addressInput, setAddressInput] = useState('')
  const [tokens, setTokens] = useState<PortfolioToken[]>([])
  const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'loaded'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [walletAvailable, setWalletAvailable] = useState(false)
  const [connecting, setConnecting] = useState(false)
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

  // Detect if a browser wallet (MetaMask, Coinbase Wallet, etc.) is present
  useEffect(() => {
    setWalletAvailable(typeof window !== 'undefined' && !!window.ethereum)
  }, [])

  // Connect wallet: requests accounts via standard EIP-1193, no library needed
  const connectWallet = useCallback(async () => {
    if (!window.ethereum) return
    setConnecting(true)
    try {
      const accounts = (await window.ethereum.request({
        method: 'eth_requestAccounts',
      })) as string[]
      if (accounts && accounts[0]) {
        setAddressInput(accounts[0])
        fetchPortfolio(accounts[0])
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Wallet connection was rejected')
    } finally {
      setConnecting(false)
    }
  }, [fetchPortfolio])

  // React to account changes/disconnects in the wallet extension
  useEffect(() => {
    if (!window.ethereum?.on) return
    const handleAccountsChanged = (...args: unknown[]) => {
      const accounts = args[0] as string[]
      if (accounts && accounts[0]) {
        setAddressInput(accounts[0])
        fetchPortfolio(accounts[0])
      }
    }
    window.ethereum.on('accountsChanged', handleAccountsChanged)
    return () => {
      window.ethereum?.removeListener?.('accountsChanged', handleAccountsChanged)
    }
  }, [fetchPortfolio])

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <h1 className="text-2xl font-bold mb-4">CastFlow Portfolio</h1>

      {/* Wallet connect + manual address input */}
      <div className="flex flex-col gap-2 mb-6">
        {walletAvailable && (
          <button
            onClick={connectWallet}
            disabled={connecting}
            className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 px-4 py-2 rounded-lg text-sm font-medium w-full"
          >
            {connecting ? 'Connecting...' : 'Connect Wallet'}
          </button>
        )}
        <div className="flex gap-2">
          <input
            type="text"
            value={addressInput}
            onChange={(e) => setAddressInput(e.target.value)}
            placeholder="or paste a 0x wallet address"
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
              {walletAvailable
                ? 'Connect your wallet or paste an address to view its Base portfolio.'
                : 'Paste a wallet address to view its Base portfolio.'}
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
            <a
              href={`https://warpcast.com/~/compose?text=${encodeURIComponent('Check out my Base portfolio on CastFlow 🌊')}&embeds[]=${encodeURIComponent(`https://castflow-frontend.vercel.app/share/${addressInput}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded-lg text-sm font-medium mb-4"
            >
              Share my Base stack 📤
            </a>
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
                    <p className="font-semibold">{token.usdValue ? `$${token.usdValue}` : "—"}</p>
                    <p className="text-xs text-gray-400">{token.balance} {token.symbol}</p>
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
