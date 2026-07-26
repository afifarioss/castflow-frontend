'use client';

import { useState } from 'react';
import {
  useAccount,
  useWalletClient,
  usePublicClient,
  useChainId,
  useSwitchChain,
} from 'wagmi';

const BASE_SEPOLIA_CHAIN_ID = 84532;

type Status =
  | { phase: 'idle' }
  | { phase: 'submitting' }
  | { phase: 'confirming'; hash: `0x${string}` }
  | { phase: 'success'; hash: `0x${string}` }
  | { phase: 'error'; message: string };

export function ListSlotButton() {
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient({ chainId: BASE_SEPOLIA_CHAIN_ID });
  const chainId = useChainId();
  const { switchChainAsync, isPending: isSwitching } = useSwitchChain();

  const [price, setPrice] = useState('0.001');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<Status>({ phase: 'idle' });

  const validate = (): string | null => {
    const priceNum = Number(price);
    if (!price || Number.isNaN(priceNum) || priceNum <= 0) {
      return 'Enter a price greater than 0 (in ETH).';
    }
    if (!description.trim()) {
      return 'Enter a description for the slot.';
    }
    return null;
  };

  const handleListSlot = async () => {
    if (!isConnected || !address || !walletClient) {
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
      if (chainId !== BASE_SEPOLIA_CHAIN_ID) {
        try {
          await switchChainAsync({ chainId: BASE_SEPOLIA_CHAIN_ID });
        } catch {
          setStatus({
            phase: 'error',
            message: 'Please switch your wallet to Base Sepolia to continue.',
          });
          return;
        }
      }

      const res = await fetch('/api/contract/list-slot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ price, description: description.trim() }),
      });

      const payload = await res.json();
      if (!res.ok) {
        setStatus({ phase: 'error', message: payload.error || 'Failed to prepare transaction.' });
        return;
      }

      const { to, data, value, chainId: txChainId } = payload;
      const hash = await walletClient.sendTransaction({
        to: to as `0x${string}`,
        data: data as `0x${string}`,
        value: BigInt(value || '0'),
        chainId: txChainId,
        account: address,
      });

      setStatus({ phase: 'confirming', hash });

      if (!publicClient) {
        setStatus({ phase: 'success', hash });
        return;
      }

      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      if (receipt.status === 'success') {
        setStatus({ phase: 'success', hash });
      } else {
        setStatus({ phase: 'error', message: `Transaction reverted. Tx: ${hash}` });
      }
    } catch (error: any) {
      setStatus({ phase: 'error', message: error?.shortMessage || error?.message || 'Unknown error.' });
    }
  };

  if (!isConnected) {
    return <div className="text-gray-400">Connect wallet to list a slot.</div>;
  }

  const isBusy = status.phase === 'submitting' || status.phase === 'confirming' || isSwitching;

  return (
    <div className="flex flex-col gap-3">
      <label className="flex flex-col gap-1 text-sm text-gray-300">
        Price (ETH)
        <input
          type="number"
          step="0.0001"
          min="0.0001"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          disabled={isBusy}
          className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-white"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm text-gray-300">
        Description
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={isBusy}
          rows={2}
          placeholder="Describe your sponsored cast slot"
          className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-white"
        />
      </label>

      <button
        onClick={handleListSlot}
        disabled={isBusy}
        className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded-xl font-medium transition"
      >
        {status.phase === 'submitting' && '⏳ Waiting for wallet...'}
        {status.phase === 'confirming' && '⏳ Confirming on-chain...'}
        {(status.phase === 'idle' || status.phase === 'success' || status.phase === 'error') &&
          '📢 List my cast slot'}
      </button>

      {status.phase === 'success' && (
        <div className="text-sm p-3 bg-white/5 rounded border border-white/10 break-all">
          ✅ Slot listed! Tx: {status.hash}
        </div>
      )}
      {status.phase === 'error' && (
        <div className="text-sm p-3 bg-red-500/10 rounded border border-red-500/30 break-all text-red-300">
          ❌ {status.message}
        </div>
      )}
    </div>
  );
}
