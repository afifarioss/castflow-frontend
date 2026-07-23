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

    // 2. Get metadata for each token (name, symbol, decimals)
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

    const validTokens = tokensWithMeta.filter(Boolean)

    return NextResponse.json({
      address,
      tokens: validTokens,
      lastUpdated: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Portfolio fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch portfolio" }, { status: 500 })
  }
}
