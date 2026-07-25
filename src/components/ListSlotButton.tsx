'use client';

import { useEffect, useState } from 'react';
import { createPublicClient, http, type Hash } from 'viem';
import { baseSepolia } from 'viem/chains';

const BASE_SEPOLIA_CHAIN_ID_HEX = '0x14a34';

const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(),
});

type Status =
  | { phase: 'idle' }
  | { phase: 'submitting' }
  | { phase: 'confirming'; hash: Hash }
  | { phase: 'success'; hash: Hash }
  | { phase: 'error'; message: string };

export function ListSlotButton() {
  const [address, setAddress] = useState<string | null>(null);
  const [price, setPrice] = useState('0.001');
  const [duration, setDuration] = useState('86400');
  const [metadata, setMetadata] = useState('');
  const [status, setStatus] = useState<Status>({ phase: 'idle' });

  useEffect(() => {
    const eth = (window as any).ethereum;
    if (!eth) return;
    eth.request({ method: 'eth_accounts' }).then((accounts: string[]) => {
      if (accounts?.[0]) setAddress(accounts[0]);
    });
    const onAccountsChanged = (accounts: string[]) => setAddress(accounts?.[0] ?? null);
    eth.on?.('accountsChanged', onAccountsChanged);
    return () => eth.removeListener?.('accountsChanged', onAccountsChanged);
  }, []);

  const connect = async () => {
    const eth = (window as any).ethereum;
    if (!eth) {
      setStatus({ phase: 'error', message: 'No wallet found. Install a wallet extension or use a wallet browser.' });
      return;
    }
    try {
      const accounts = await eth.request({ method: 'eth_requestAccounts' });
      setAddress(accounts?.[0] ?? null);
    } catch (error: any) {
      setStatus({ phase: 'error', message: error?.message || 'Failed to connect wallet.' });
    }
  };

  const validate = (): string | null => {
    const priceNum = Number(price);
    const durationNum = Number(duration);
    if (!price || Number.isNaN(priceNum) || priceNum <= 0) return 'Enter a price greater than 0 (in ETH).';
    if (!duration || !Number.isInteger(durationNum) || durationNum <= 0) return 'Enter a duration greater than 0 (in seconds).';
    if (!metadata.trim()) return 'Enter a description for the slot.';
    return null;
  };

  const handleListSlot = async () => {
    const eth = (window as any).ethereum;
    if (!eth || !address) {
      setStatus({ phase: 'error', message: 'Please connect your wallet first.' });
      return;
    }
    const validationError = validate();
    if (validationError) {
      setStatus({ phase: 'error', message: validationError });
      return;
    }

    setStatus({ phase: 'submitting' });

    try {
      const currentChainId = await eth.request({ method: 'eth_chainId' });
      if (currentChainId !== BASE_SEPOLIA_CHAIN_ID_HEX) {
        try {
          await eth.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: BASE_SEPOLIA_CHAIN_ID_HEX }],
          });
        } catch {
          setStatus({ phase: 'error', message: 'Please switch your wallet to Base Sepolia to continue.' });
          return;
        }
      }

      const res = await fetch('/api/contract/list-slot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ price, duration: Number(duration), metadata: metadata.trim() }),
      });
      const payload = await res.json();
      if (!res.ok) {
        setStatus({ phase: 'error', message: payload.error || 'Failed to prepare transaction.' });
        return;
      }

      const { to, data, value } = payload;
      const hash: Hash = await eth.request({
        method: 'eth_sendTransaction',
        params: [{ from: address, to, data, value: value === '0' ? '0x0' : value }],
      });

      setStatus({ phase: 'confirming', hash });

      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      if (receipt.status === 'success') {
        setStatus({ phase: 'success', hash });
      } else {
        setStatus({ phase: 'error', message: `Transaction reverted. Tx: ${hash}` });
      }
    } catch (error: any) {
      setStatus({ phase: 'error', message: error?.message || 'Unknown error.' });
    }
  };

  if (!address) {
    return (
      <button onClick={connect} className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-medium transition">
        Connect wallet
      </button>
    );
  }

  const isBusy = status.phase === 'submitting' || status.phase === 'confirming';

  return (
    <div className="flex flex-col gap-3">
      <label className="flex flex-col gap-1 text-sm text-gray-300">
        Price (ETH)
        <input type="number" step="0.0001" min="0" value={price} onChange={(e) => setPrice(e.target.value)}
          disabled={isBusy} className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-white" />
      </label>
      <label className="flex flex-col gap-1 text-sm text-gray-300">
        Duration (seconds)
        <input type="number" step="1" min="1" value={duration} onChange={(e) => setDuration(e.target.value)}
          disabled={isBusy} className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-white" />
      </label>
      <label className="flex flex-col gap-1 text-sm text-gray-300">
        Slot description
        <textarea value={metadata} onChange={(e) => setMetadata(e.target.value)} disabled={isBusy} rows={2}
          placeholder="e.g. Sponsored cast in my next thread"
          className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-white" />
      </label>
      <button onClick={handleListSlot} disabled={isBusy}
        className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded-xl font-medium transition">
        {status.phase === 'submitting' && '⏳ Waiting for wallet...'}
        {status.phase === 'confirming' && '⏳ Confirming on-chain...'}
        {(status.phase === 'idle' || status.phase === 'success' || status.phase === 'error') && '📢 List my cast slot'}
      </button>
      {status.phase === 'success' && (
        <div className="text-sm p-3 bg-white/5 rounded border border-white/10 break-all">✅ Slot listed! Tx: {status.hash}</div>
      )}
      {status.phase === 'error' && (
        <div className="text-sm p-3 bg-red-500/10 rounded border border-red-500/30 break-all text-red-300">❌ {status.message}</div>
      )}
    </div>
  );
}
