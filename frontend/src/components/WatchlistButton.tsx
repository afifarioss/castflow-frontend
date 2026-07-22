'use client'

import { useState } from 'react'
import { useWatchlist, type WatchlistedToken } from '@/hooks/useWatchlist'

interface WatchlistButtonProps {
  token: WatchlistedToken
}

export function WatchlistButton({ token }: WatchlistButtonProps) {
  const { isWatchlisted, addToken, removeToken } = useWatchlist()
  const [isAdding, setIsAdding] = useState(false)

  const watchlisted = isWatchlisted(token.address)

  const handleToggle = async () => {
    setIsAdding(true)
    try {
      if (watchlisted) {
        removeToken(token.address)
      } else {
        addToken(token)
      }
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isAdding}
      className={`
        p-2 rounded transition-all
        ${watchlisted 
          ? 'text-yellow-400 hover:text-yellow-300' 
          : 'text-gray-500 hover:text-gray-400'
        }
        disabled:opacity-50 disabled:cursor-not-allowed
      `}
      title={watchlisted ? 'Remove from watchlist' : 'Add to watchlist'}
    >
      {watchlisted ? '★' : '☆'}
    </button>
  )
}
