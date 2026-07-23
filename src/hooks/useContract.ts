"use client";

import { useReadContract, useWriteContract } from "wagmi";
import { parseEther } from "viem";
import { useCallback } from "react";

const adRegistryAbi = [
  {
    name: "createAdSlot",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "fid", type: "uint256" },
      { name: "castHash", type: "string" },
      { name: "reservePrice", type: "uint256" },
      { name: "expiresAt", type: "uint256" },
    ],
    outputs: [{ name: "slotId", type: "uint256" }],
  },
] as const;

const adAuctionAbi = [
  {
    name: "placeBid",
    type: "function",
    stateMutability: "payable",
    inputs: [
      { name: "slotId", type: "uint256" },
    ],
    outputs: [],
  },
] as const;

export function useContract() {
  const { writeContractAsync } = useWriteContract();

  const adRegistryAddress = process.env.NEXT_PUBLIC_CASTFLOW_AD_REGISTRY as `0x${string}`;
  const adAuctionAddress = process.env.NEXT_PUBLIC_CASTFLOW_AD_AUCTION as `0x${string}`;

  const createAdSlot = useCallback(
    async (fid: number, castHash: string, reservePrice: string, expiresAt: number) => {
      try {
        const tx = await writeContractAsync({
          address: adRegistryAddress,
          abi: adRegistryAbi,
          functionName: "createAdSlot",
          args: [BigInt(fid), castHash, parseEther(reservePrice), BigInt(expiresAt)],
        });
        return tx;
      } catch (error) {
        console.error("createAdSlot error:", error);
        throw error;
      }
    },
    [writeContractAsync, adRegistryAddress]
  );

  const placeBid = useCallback(
    async (slotId: number, bidAmount: string) => {
      try {
        const tx = await writeContractAsync({
          address: adAuctionAddress,
          abi: adAuctionAbi,
          functionName: "placeBid",
          args: [BigInt(slotId)],
          value: parseEther(bidAmount),
        });
        return tx;
      } catch (error) {
        console.error("placeBid error:", error);
        throw error;
      }
    },
    [writeContractAsync, adAuctionAddress]
  );

  return {
    createAdSlot,
    placeBid,
  };
}