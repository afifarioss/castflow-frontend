'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface WatchlistedToken {
  address: string
  symbol: string
  name: string
  logo?: string
  addedAt?: number
}

interface WatchlistContextType {
  watchlist: WatchlistedToken[]
  addToken: (token: WatchlistedToken) => void
  removeToken: (address: string) => void
  isWatchlisted: (address: string) => boolean
  loading: boolean
  count: number
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined)

export function WatchlistProvider({ children }: { children: ReactNode }) {
  const [watchlist, setWatchlist] = useState<WatchlistedToken[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('castflow_watchlist')
      if (stored) {
        setWatchlist(JSON.parse(stored))
      }
    } catch (error) {
      console.error('Failed to load watchlist:', error)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    if (!loading) {
      localStorage.setItem('castflow_watchlist', JSON.stringify(watchlist))
    }
  }, [watchlist, loading])

  const addToken = (token: WatchlistedToken) => {
    setWatchlist((prev) => {
      if (prev.find((t) => t.address.toLowerCase() === token.address.toLowerCase())) {
        return prev
      }
      return [...prev, { ...token, addedAt: Date.now() }]
    })
  }

  const removeToken = (address: string) => {
    setWatchlist((prev) =>
      prev.filter((t) => t.address.toLowerCase() !== address.toLowerCase())
    )
  }

  const isWatchlisted = (address: string) => {
    return watchlist.some((t) => t.address.toLowerCase() === address.toLowerCase())
  }

  return (
    <WatchlistContext.Provider
      value={{ watchlist, addToken, removeToken, isWatchlisted, loading, count: watchlist.length }}
    >
      {children}
    </WatchlistContext.Provider>
  )
}

export function useWatchlist() {
  const context = useContext(WatchlistContext)
  if (!context) {
    throw new Error('useWatchlist must be used within a WatchlistProvider')
  }
  return context
}
