'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'

const USDC_BASE = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'
const RECIPIENT = '0x7845D45d9E53268EBFf3C4a9daBb994cE5b93918'
const RECIPIENT_BASENAME = 'afifarioss.base.eth'
const BASE_CHAIN_ID_HEX = '0x2105'
const USDC_DECIMALS = 6

const PRESET_AMOUNTS = [0.03, 0.1, 1] as const

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>
    }
  }
}

function toUsdcUnits(amount: number): bigint {
  return BigInt(Math.round(amount * 10 ** USDC_DECIMALS))
}

function encodeErc20Transfer(to: string, amount: bigint): string {
  const selector = 'a9059cbb'
  const toPadded = to.slice(2).toLowerCase().padStart(64, '0')
  const amountPadded = amount.toString(16).padStart(64, '0')
  return `0x${selector}${toPadded}${amountPadded}`
}

async function ensureBaseMainnet() {
  if (!window.ethereum) throw new Error('No wallet found')
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: BASE_CHAIN_ID_HEX }],
    })
  } catch (err) {
    const code = (err as { code?: number })?.code
    if (code === 4902) {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: BASE_CHAIN_ID_HEX,
            chainName: 'Base',
            nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
            rpcUrls: ['https://mainnet.base.org'],
            blockExplorerUrls: ['https://basescan.org'],
          },
        ],
      })
    } else {
      throw err
    }
  }
}

export function SupportButton() {
  const [amount, setAmount] = useState<number>(PRESET_AMOUNTS[0])
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [txHash, setTxHash] = useState('')

  const sendTip = async () => {
    if (!window.ethereum) {
      setStatus('error')
      setErrorMsg('No wallet found. Install a wallet like MetaMask or Coinbase Wallet.')
      return
    }
    setStatus('sending')
    setErrorMsg('')
    try {
      const accounts = (await window.ethereum.request({
        method: 'eth_requestAccounts',
      })) as string[]
      const from = accounts[0]
      if (!from) throw new Error('No account connected')

      await ensureBaseMainnet()

      const data = encodeErc20Transfer(RECIPIENT, toUsdcUnits(amount))
      const hash = (await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [{ from, to: USDC_BASE, data }],
      })) as string

      setTxHash(hash)
      setStatus('sent')
    } catch (err) {
      setStatus('error')
      setErrorMsg(err instanceof Error ? err.message : 'Transaction was not completed')
    }
  }

  return (
    <div className="bg-black/20 rounded-xl p-6 text-left space-y-4 max-w-md mx-auto">
      <div>
        <h2 className="text-lg font-semibold text-primary">Support CastFlow</h2>
        <p className="text-sm text-text-secondary mt-1">
          Send USDC directly from your wallet — nothing passes through a server.
          Goes straight to <span className="text-primary">{RECIPIENT_BASENAME}</span> on Base.
        </p>
      </div>

      <div className="flex gap-2">
        {PRESET_AMOUNTS.map((preset) => (
          <button
            key={preset}
            onClick={() => setAmount(preset)}
            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
              amount === preset
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-white/10 text-text-secondary hover:border-white/30'
            }`}
          >
            ${preset.toFixed(2)}
          </button>
        ))}
      </div>

      <Button
        variant="accent"
        size="md"
        onClick={sendTip}
        disabled={status === 'sending'}
        className="w-full"
      >
        {status === 'sending' ? 'Confirm in wallet...' : `Send $${amount.toFixed(2)} USDC`}
      </Button>

      {status === 'sent' && (
        <p className="text-sm text-green-400">
          Sent! View on{' '}
          <a
            href={`https://basescan.org/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            Basescan
          </a>
        </p>
      )}
      {status === 'error' && <p className="text-sm text-red-400">{errorMsg}</p>}
    </div>
  )
}
