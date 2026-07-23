import { NextRequest, NextResponse } from "next/server";

const COINBASE_SPOT_URL = "https://api.coinbase.com/v2/prices";
const FIAT = "USD";
const CACHE_TTL_MS = 15_000;
const priceCache = new Map<string, { price: number; ts: number }>();

interface CoinbaseSpotResponse {
  data: { base: string; currency: string; amount: string };
}

async function fetchSpotPrice(symbol: string): Promise<number | null> {
  const cached = priceCache.get(symbol);
  if (cached && Date.now() - cached.ts < CACHE_TTL_MS) return cached.price;

  if (symbol.toUpperCase() === "USDC") {
    priceCache.set(symbol, { price: 1.0, ts: Date.now() });
    return 1.0;
  }

  const pair = `${symbol.toUpperCase()}-${FIAT}`;
  try {
    const res = await fetch(`${COINBASE_SPOT_URL}/${pair}/spot`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 15 },
    });
    if (!res.ok) return null;
    const json = (await res.json()) as CoinbaseSpotResponse;
    const price = parseFloat(json.data.amount);
    if (Number.isNaN(price)) return null;
    priceCache.set(symbol, { price, ts: Date.now() });
    return price;
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  const tokensParam = req.nextUrl.searchParams.get("tokens");
  if (!tokensParam) {
    return NextResponse.json({ error: "Missing tokens param, e.g. ?tokens=BTC,ETH,USDC" }, { status: 400 });
  }
  const symbols = tokensParam.split(",").map((s) => s.trim().toUpperCase()).filter(Boolean);
  const results = await Promise.all(symbols.map(async (symbol) => ({ symbol, price: await fetchSpotPrice(symbol) })));
  const prices: Record<string, number> = {};
  const failed: string[] = [];
  for (const { symbol, price } of results) {
    if (price !== null) prices[symbol] = price;
    else failed.push(symbol);
  }
  return NextResponse.json({ prices, ...(failed.length > 0 && { failed }), asOf: new Date().toISOString() });
}
