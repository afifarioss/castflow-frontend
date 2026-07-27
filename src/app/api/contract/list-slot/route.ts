import { NextRequest, NextResponse } from 'next/server';
import { encodeFunctionData, parseEther } from 'viem';

const AD_REGISTRY_ADDRESS = '0xcD9A23aAf3880CacfB4ff340CBffa513F1Ab6F7C' as const;
const BASE_SEPOLIA_CHAIN_ID = 84532;

const MIN_PRICE_ETH = 0.0001;
const MAX_PRICE_ETH = 10;
const MAX_DESCRIPTION_LENGTH = 2000;

const AD_REGISTRY_ABI = [
  {
    inputs: [
      { name: 'price', type: 'uint256' },
      { name: 'description', type: 'string' },
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

  const { price, description } = body ?? {};

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

  if (typeof description !== 'string' || description.trim().length === 0) {
    return badRequest('description is required and must be a non-empty string.');
  }
  if (description.length > MAX_DESCRIPTION_LENGTH) {
    return badRequest(`description must be ${MAX_DESCRIPTION_LENGTH} characters or fewer.`);
  }

  try {
    const calldata = encodeFunctionData({
      abi: AD_REGISTRY_ABI,
      functionName: 'listSlot',
      args: [parseEther(priceNum.toString()), description.trim()],
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
