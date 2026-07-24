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

interface FrenTokenInfo {
  symbol: string
  name: string
  count: number
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
  const [activeTab, setActiveTab] = useState<'portfolio' | 'watchlist' | 'frens'>('portfolio')
  const [addressInput, setAddressInput] = useState('')
  const [fidInput, setFidInput] = useState('')
  const [tokens, setTokens] = useState<PortfolioToken[]>([])
  const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'loaded'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [walletAvailable, setWalletAvailable] = useState(false)
  const [connecting, setConnecting] = useState(false)
  const { count } = useWatchlist()

  const [frenHoldings, setFrenHoldings] = useState<Record<string, FrenTokenInfo>>({})
  const [frenTopTokens, setFrenTopTokens] = useState<{ address: string; symbol: string; name: string; count: number }[]>([])
  const [frenStatus, setFrenStatus] = useState<'idle' | 'loading' | 'error' | 'loaded'>('idle')
  const [frenErrorMsg, setFrenErrorMsg] = useState('')
  const [frensChecked, setFrensChecked] = useState(0)

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

  const fetchFrensHoldings = useCallback(async (fid: string) => {
    if (!fid) return
    setFrenStatus('loading')
    setFrenErrorMsg('')
    try {
      const res = await fetch(`/api/frens-holdings?fid=${fid}`)
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Failed to load frens data')
      }
      setFrenHoldings(data.holdingCounts || {})
      setFrenTopTokens(data.topTokens || [])
      setFrensChecked(data.frensChecked || 0)
      setFrenStatus('loaded')
    } catch (err) {
      setFrenStatus('error')
      setFrenErrorMsg(err instanceof Error ? err.message : 'Could not load frens data')
    }
  }, [])

  useEffect(() => {
    setWalletAvailable(typeof window !== 'undefined' && !!window.ethereum)
  }, [])

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

  const shareCastText =
    "I built CastFlow — a simple way to view and share your Base wallet portfolio on Farcaster. Try my portfolio below 🌊"

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <h1 className="text-2xl font-bold mb-4">CastFlow Portfolio</h1>

      <div className="bg-yellow-900/20 border border-yellow-700/40 rounded-xl p-3 mb-4 text-sm text-yellow-200">
        📌 <span className="font-medium">Past experiment:</span> CastFlow is now a decentralized ad protocol.
        <a href="/" className="text-yellow-400 underline ml-1">Back to the main site</a>
      </div>

      {/* Wallet connect + manual address input */}
      <div className="flex flex-col gap-2 mb-1">
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

      {/* Trust copy — sits right under the connect controls */}
      <p className="text-xs text-gray-500 mb-6">
        🔒 Read-only. No wallet signature required.
      </p>

      {/* Farcaster FID input for frens discovery */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={fidInput}
          onChange={(e) => setFidInput(e.target.value)}
          placeholder="Farcaster FID (e.g. 3)"
          className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500"
        />
        <button
          onClick={() => fetchFrensHoldings(fidInput)}
          disabled={frenStatus === 'loading'}
          className="bg-teal-600 hover:bg-teal-500 disabled:opacity-50 px-4 py-2 rounded-lg text-sm font-medium"
        >
          {frenStatus === 'loading' ? 'Checking...' : 'Load Frens'}
        </button>
      </div>

      {/* Share button */}
      {status === 'loaded' && tokens.length > 0 && (
        <a
          href={`https://warpcast.com/~/compose?text=${encodeURIComponent(shareCastText)}&embeds[]=${encodeURIComponent(`https://castflow-frontend.vercel.app/share/${addressInput}`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-center bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded-lg text-sm font-medium mb-4"
        >
          Share this portfolio as a cast 📤
        </a>
      )}

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-gray-700 overflow-x-auto">
        <button
          onClick={() => setActiveTab('portfolio')}
          className={`pb-3 px-2 font-medium transition-colors whitespace-nowrap ${
            activeTab === 'portfolio'
              ? 'text-blue-400 border-b-2 border-blue-400'
              : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          Portfolio ({tokens.length})
        </button>
        <button
          onClick={() => setActiveTab('watchlist')}
          className={`pb-3 px-2 font-medium transition-colors whitespace-nowrap ${
            activeTab === 'watchlist'
              ? 'text-blue-400 border-b-2 border-blue-400'
              : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          ★ Watchlist ({count})
        </button>
        <button
          onClick={() => setActiveTab('frens')}
          className={`pb-3 px-2 font-medium transition-colors whitespace-nowrap ${
            activeTab === 'frens'
              ? 'text-blue-400 border-b-2 border-blue-400'
              : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          👥 Frens ({frenTopTokens.length})
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'portfolio' && (
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
            <div className="space-y-2">
              {tokens.map((token) => {
                const frenInfo = frenHoldings[token.address.toLowerCase()]
                return (
                  <div
                    key={token.address}
                    className="flex items-center justify-between p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{token.symbol}</p>
                      <p className="text-xs text-gray-400">{token.name}</p>
                      {frenStatus === 'loaded' && frenInfo && (
                        <p className="text-xs text-teal-400 mt-1">
                          👥 {frenInfo.count} {frenInfo.count === 1 ? 'fren' : 'frens'} also hold this
                        </p>
                      )}
                    </div>
                    <div className="text-right mr-3">
                      <p className="font-semibold">{token.usdValue ? `$${token.usdValue}` : "—"}</p>
                      <p className="text-xs text-gray-400">{token.balance} {token.symbol}</p>
                    </div>
                    <WatchlistButton token={token} />
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}

      {activeTab === 'watchlist' && <WatchlistTab allTokens={tokens} />}

      {activeTab === 'frens' && (
        <div>
          {frenStatus === 'idle' && (
            <p className="text-center text-gray-500 py-8 text-sm">
              Enter a Farcaster FID above and tap &quot;Load Frens&quot; to see what your network holds.
            </p>
          )}
          {frenStatus === 'loading' && (
            <p className="text-center text-gray-500 py-8 text-sm">Checking frens&apos; portfolios...</p>
          )}
          {frenStatus === 'error' && (
            <p className="text-center text-red-400 py-8 text-sm">{frenErrorMsg}</p>
          )}
          {frenStatus === 'loaded' && (
            <>
              <p className="text-xs text-gray-500 mb-3">
                Based on {frensChecked} frens with verified wallets
              </p>
              {frenTopTokens.length === 0 ? (
                <p className="text-center text-gray-500 py-8 text-sm">No shared holdings found among frens.</p>
              ) : (
                <div className="space-y-2">
                  {frenTopTokens.map((t, i) => (
                    <div
                      key={t.address}
                      className="flex items-center justify-between p-3 bg-gray-800 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-gray-500 text-sm w-5">{i + 1}</span>
                        <div>
                          <p className="font-medium">{t.symbol}</p>
                          <p className="text-xs text-gray-400">{t.name}</p>
                        </div>
                      </div>
                      <p className="text-teal-400 font-semibold text-sm">
                        {t.count} {t.count === 1 ? 'fren' : 'frens'}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
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
