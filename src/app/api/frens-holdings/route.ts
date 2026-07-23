import { NextRequest, NextResponse } from "next/server"

const NEYNAR_KEY = process.env.NEYNAR_API_KEY
const FREN_LIMIT = 20 // cap to avoid rate limits / slow response

interface NeynarUser {
  fid: number
  verified_addresses?: {
    eth_addresses?: string[]
  }
}

// Simple in-memory cache: 5 minutes per FID
const cache = new Map<string, { data: unknown; expires: number }>()
const CACHE_TTL_MS = 5 * 60 * 1000

export async function GET(req: NextRequest) {
  const fid = req.nextUrl.searchParams.get("fid")

  if (!fid) {
    return NextResponse.json({ error: "Missing fid parameter" }, { status: 400 })
  }

  if (!NEYNAR_KEY) {
    return NextResponse.json({ error: "Server misconfiguration: missing Neynar key" }, { status: 500 })
  }

  const cacheKey = `frens-holdings:${fid}`
  const cached = cache.get(cacheKey)
  if (cached && cached.expires > Date.now()) {
    return NextResponse.json(cached.data)
  }

  try {
    // 1. Get who this FID follows
    const followingRes = await fetch(
      `https://api.neynar.com/v2/farcaster/following?fid=${fid}&limit=${FREN_LIMIT}`,
      { headers: { "x-api-key": NEYNAR_KEY } }
    )
    if (!followingRes.ok) {
      throw new Error(`Neynar following fetch failed: ${followingRes.status}`)
    }
    const followingData = await followingRes.json()

    // Response shape: { users: [{ object: "follow", user: {...} }] } OR { users: [{...}] }
    const rawUsers: NeynarUser[] = (followingData.users || [])
      .map((entry: { user?: NeynarUser } & NeynarUser) => entry.user || entry)
      .filter(Boolean)

    // 2. Extract verified Base/Ethereum addresses
    const frenAddresses = rawUsers
      .map((u) => u.verified_addresses?.eth_addresses?.[0])
      .filter((addr): addr is string => !!addr)

    if (frenAddresses.length === 0) {
      const result = { fid, frensChecked: 0, holdingCounts: {}, topTokens: [] }
      cache.set(cacheKey, { data: result, expires: Date.now() + CACHE_TTL_MS })
      return NextResponse.json(result)
    }

    // 3. Fetch each fren's portfolio via our own portfolio API (reuses trusted logic)
    const portfolioResults = await Promise.allSettled(
      frenAddresses.map((addr) =>
        fetch(`${req.nextUrl.origin}/api/portfolio?address=${addr}`).then((r) => r.json())
      )
    )

    // 4. Aggregate: count how many frens hold each token (by contract address)
    const holdingCounts: Record<string, { symbol: string; name: string; count: number }> = {}

    for (const result of portfolioResults) {
      if (result.status !== "fulfilled") continue
      const tokens = result.value?.tokens || []
      for (const token of tokens) {
        const key = token.address.toLowerCase()
        if (!holdingCounts[key]) {
          holdingCounts[key] = { symbol: token.symbol, name: token.name, count: 0 }
        }
        holdingCounts[key].count += 1
      }
    }

    const topTokens = Object.entries(holdingCounts)
      .map(([address, info]) => ({ address, ...info }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    const result = {
      fid,
      frensChecked: frenAddresses.length,
      holdingCounts,
      topTokens,
    }

    cache.set(cacheKey, { data: result, expires: Date.now() + CACHE_TTL_MS })
    return NextResponse.json(result)
  } catch (error) {
    console.error("Frens holdings fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch frens holdings" }, { status: 500 })
  }
}
