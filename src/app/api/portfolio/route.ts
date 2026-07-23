import { NextRequest, NextResponse } from "next/server"

const ALCHEMY_KEY = process.env.ALCHEMY_KEY || process.env.NEXT_PUBLIC_ALCHEMY_KEY

interface TokenBalance {
  contractAddress: string
  tokenBalance: string
}

interface TokenMetadata {
  name: string | null
  symbol: string | null
  decimals: number | null
  logo: string | null
}

export async function GET(req: NextRequest) {
  const address = req.nextUrl.searchParams.get("address")

  if (!address) {
    return NextResponse.json({ error: "Missing address parameter" }, { status: 400 })
  }

  if (!ALCHEMY_KEY) {
    return NextResponse.json({ error: "Server misconfiguration: missing Alchemy key" }, { status: 500 })
  }

  try {
    // 1. Get token balances
    const balancesRes = await fetch(
      `https://base-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "alchemy_getTokenBalances",
          params: [address],
        }),
      }
    )
    const balancesData = await balancesRes.json()
    const balances: TokenBalance[] = (balancesData.result?.tokenBalances || [])
      .filter((t: TokenBalance) => t.tokenBalance !== "0x0000000000000000000000000000000000000000000000000000000000000000")

    // 2. Get metadata for each token
    const tokensWithMeta = await Promise.all(
      balances.slice(0, 25).map(async (token) => {
        try {
          const metaRes = await fetch(
            `https://base-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                jsonrpc: "2.0",
                id: 1,
                method: "alchemy_getTokenMetadata",
                params: [token.contractAddress],
              }),
            }
          )
          const metaData = await metaRes.json()
          const meta: TokenMetadata = metaData.result || {}

          const decimals = meta.decimals ?? 18
          const rawBalance = BigInt(token.tokenBalance)
          const balance = Number(rawBalance) / Math.pow(10, decimals)

          return {
            address: token.contractAddress,
            symbol: meta.symbol || "???",
            name: meta.name || "Unknown Token",
            balance: balance.toFixed(4),
            logo: meta.logo,
          }
        } catch {
          return null
        }
      })
    )

    const validTokens = tokensWithMeta.filter(
      (t): t is NonNullable<typeof t> => t !== null
    )

    // 3. Get prices for all tokens in one batch call (Alchemy Prices API, by symbol)
    let priceMap: Record<string, { price: number; change24h: number }> = {}
    try {
      const symbols = validTokens.map((t) => t.symbol).filter((s) => s !== "???")
      if (symbols.length > 0) {
        const priceRes = await fetch(
          `https://api.g.alchemy.com/prices/v1/${ALCHEMY_KEY}/tokens/by-symbol?${symbols
            .map((s) => `symbols=${encodeURIComponent(s)}`)
            .join("&")}`
        )
        if (priceRes.ok) {
          const priceData = await priceRes.json()
          for (const entry of priceData.data || []) {
            const usdPrice = entry.prices?.find((p: { currency: string }) => p.currency === "usd")
            if (usdPrice) {
              priceMap[entry.symbol] = {
                price: parseFloat(usdPrice.value),
                change24h: 0, // Alchemy Prices API (current) doesn't return 24h change directly
              }
            }
          }
        }
      }
    } catch (priceErr) {
      console.error("Price fetch failed (non-fatal):", priceErr)
    }

    const tokensWithPrices = validTokens.map((token) => {
      const priceInfo = priceMap[token.symbol]
      const usdValue = priceInfo ? (parseFloat(token.balance) * priceInfo.price).toFixed(2) : undefined
      return {
        ...token,
        usdValue,
        change24h: priceInfo ? `${priceInfo.change24h >= 0 ? "+" : ""}${priceInfo.change24h.toFixed(1)}%` : undefined,
      }
    })

    return NextResponse.json({
      address,
      tokens: tokensWithPrices,
      lastUpdated: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Portfolio fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch portfolio" }, { status: 500 })
  }
}
