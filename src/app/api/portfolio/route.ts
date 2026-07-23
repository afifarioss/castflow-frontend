import { NextRequest, NextResponse } from "next/server"

const ALCHEMY_KEY = process.env.ALCHEMY_KEY || process.env.NEXT_PUBLIC_ALCHEMY_KEY
const BASE_CHAIN = "base"

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

    // 3. Get prices BY CONTRACT ADDRESS (not symbol) — avoids mispricing spam/scam tokens
    // that copy real token symbols like "ETH" or "USDC"
    let priceMap: Record<string, number> = {}
    try {
      const addressList = validTokens.map((t) => ({
        network: BASE_CHAIN,
        address: t.address,
      }))

      if (addressList.length > 0) {
        const priceRes = await fetch(
          `https://api.g.alchemy.com/prices/v1/${ALCHEMY_KEY}/tokens/by-address`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ addresses: addressList }),
          }
        )
        if (priceRes.ok) {
          const priceData = await priceRes.json()
          for (const entry of priceData.data || []) {
            const usdPrice = entry.prices?.find((p: { currency: string }) => p.currency === "usd")
            if (usdPrice && !entry.error) {
              priceMap[entry.address.toLowerCase()] = parseFloat(usdPrice.value)
            }
          }
        }
      }
    } catch (priceErr) {
      console.error("Price fetch failed (non-fatal):", priceErr)
    }

    // Only attach usdValue when we have a REAL, verified price for that exact contract.
    // No fake 24h change — we don't have reliable data for it, so we don't show it.
    const tokensWithPrices = validTokens.map((token) => {
      const price = priceMap[token.address.toLowerCase()]
      return {
        ...token,
        usdValue: price !== undefined ? (parseFloat(token.balance) * price).toFixed(2) : undefined,
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
