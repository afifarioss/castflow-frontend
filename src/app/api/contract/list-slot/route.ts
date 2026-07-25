import { NextRequest, NextResponse } from 'next/server';
import { encodeFunctionData, parseEther } from 'viem';

const AD_REGISTRY_ADDRESS = '0xcD9A23aAf3880CacfB4ff340CBffa513F1Ab6F7C' as const;
const BASE_SEPOLIA_CHAIN_ID = 84532;

const MIN_PRICE_ETH = 0.0001;
const MAX_PRICE_ETH = 10;
const MIN_DURATION_SECONDS = 3600;
const MAX_DURATION_SECONDS = 60 * 60 * 24 * 90;
const MAX_METADATA_LENGTH = 2000;

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

function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

export async function POST(req: NextRequest) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return badRequest('Invalid JSON body.');
  }

  const { price, duration, metadata } = body ?? {};

  const priceNum = Number(price);
  if (price === undefined || price === null || Number.isNaN(priceNum)) {
    return badRequest('price is required and must be a number (in ETH).');
  }
  if (priceNum <= 0) {
    return badRequest('price must be greater than 0.');
  }
  if (priceNum < MIN_PRICE_ETH || priceNum > MAX_PRICE_ETH) {
    return badRequest(`price must be between ${MIN_PRICE_ETH} and ${MAX_PRICE_ETH} ETH.`);
  }

  const durationNum = Number(duration);
  if (duration === undefined || duration === null || !Number.isInteger(durationNum)) {
    return badRequest('duration is required and must be an integer number of seconds.');
  }
  if (durationNum <= 0) {
    return badRequest('duration must be greater than 0.');
  }
  if (durationNum < MIN_DURATION_SECONDS || durationNum > MAX_DURATION_SECONDS) {
    return badRequest(`duration must be between ${MIN_DURATION_SECONDS} and ${MAX_DURATION_SECONDS} seconds.`);
  }

  if (typeof metadata !== 'string' || metadata.trim().length === 0) {
    return badRequest('metadata is required and must be a non-empty string.');
  }
  if (metadata.length > MAX_METADATA_LENGTH) {
    return badRequest(`metadata must be ${MAX_METADATA_LENGTH} characters or fewer.`);
  }

  try {
    const calldata = encodeFunctionData({
      abi: AD_REGISTRY_ABI,
      functionName: 'listSlot',
      args: [parseEther(priceNum.toString()), BigInt(durationNum), metadata.trim()],
    });

    return NextResponse.json({
      to: AD_REGISTRY_ADDRESS,
      data: calldata,
      value: '0',
      chainId: BASE_SEPOLIA_CHAIN_ID,
    });
  } catch (error: any) {
    console.error('listSlot calldata encoding failed:', error);
    return NextResponse.json({ error: 'Failed to encode transaction.' }, { status: 500 });
  }
}
