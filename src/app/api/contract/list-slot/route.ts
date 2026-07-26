import { NextRequest, NextResponse } from 'next/server';
import { encodeFunctionData, parseEther } from 'viem';

const AD_REGISTRY_ADDRESS = '0xcD9A23aAf3880CacfB4ff340CBffa513F1Ab6F7C' as const;
const BASE_SEPOLIA_CHAIN_ID = 84532;

const AD_REGISTRY_ABI = [
  {
    inputs: [
      { name: 'price', type: 'uint256' },
      { name: 'duration', type: 'uint256' },
      { name: 'metadata', type: 'string' },
    ],
    name: 'listSlot',
    outputs: [{ name: 'slotId', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;

export async function POST(req: NextRequest) {
  try {
    const { price, duration, metadata } = await req.json();

    const priceNum = Number(price);
    const durationNum = Number(duration);
    if (isNaN(priceNum) || priceNum <= 0) {
      return NextResponse.json(
        { error: 'Price must be a positive number (in ETH).' },
        { status: 400 }
      );
    }
    if (!Number.isInteger(durationNum) || durationNum <= 0) {
      return NextResponse.json(
        { error: 'Duration must be a positive integer (in seconds).' },
        { status: 400 }
      );
    }
    if (!metadata || metadata.trim().length === 0) {
      return NextResponse.json(
        { error: 'Metadata (slot description) is required.' },
        { status: 400 }
      );
    }

    const calldata = encodeFunctionData({
      abi: AD_REGISTRY_ABI,
      functionName: 'listSlot',
      args: [
        parseEther(priceNum.toString()),
        BigInt(durationNum),
        metadata.trim(),
      ],
    });

    return NextResponse.json({
      to: AD_REGISTRY_ADDRESS,
      data: calldata,
      value: '0',
      chainId: BASE_SEPOLIA_CHAIN_ID,
    });
  } catch (error: any) {
    console.error('listSlot API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to encode transaction.' },
      { status: 500 }
    );
  }
}
