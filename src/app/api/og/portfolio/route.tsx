import { ImageResponse } from "@vercel/og"
import { NextRequest } from "next/server"

export const runtime = "edge"

export async function GET(req: NextRequest) {
  const address = req.nextUrl.searchParams.get("address")

  if (!address) {
    return new Response("Missing address", { status: 400 })
  }

  const shortAddress = `${address.slice(0, 6)}...${address.slice(-4)}`

  let tokens: { symbol: string; usdValue?: string; logo?: string | null }[] = []
  try {
    const portfolioRes = await fetch(
      `${req.nextUrl.origin}/api/portfolio?address=${address}`
    )
    const data = await portfolioRes.json()
    tokens = data.tokens || []
  } catch {
    // fall through with empty tokens
  }

  const pricedTokens = tokens.filter((t) => t.usdValue !== undefined)
  const totalValue = pricedTokens.reduce((sum, t) => sum + parseFloat(t.usdValue || "0"), 0)
  const topHoldings = [...pricedTokens]
    .sort((a, b) => parseFloat(b.usdValue || "0") - parseFloat(a.usdValue || "0"))
    .slice(0, 3)

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#000000",
          color: "#ffffff",
          padding: "60px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "32px" }}>
          <span style={{ fontSize: 36, fontWeight: 700 }}>🌊 CastFlow</span>
          <span style={{ fontSize: 22, color: "#9ca3af" }}>{shortAddress}</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", marginBottom: "40px" }}>
          <span style={{ fontSize: 24, color: "#9ca3af" }}>Portfolio Value</span>
          <span style={{ fontSize: 72, fontWeight: 800 }}>
            {pricedTokens.length > 0 ? `$${totalValue.toFixed(2)}` : "—"}
          </span>
          {pricedTokens.length < tokens.length && (
            <span style={{ fontSize: 18, color: "#6b7280" }}>
              ({pricedTokens.length} of {tokens.length} tokens priced)
            </span>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {topHoldings.length > 0 ? (
            topHoldings.map((t, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  fontSize: 28,
                  padding: "12px 20px",
                  backgroundColor: "#18181b",
                  borderRadius: "12px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  {t.logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={t.logo}
                      width={36}
                      height={36}
                      style={{ borderRadius: "50%" }}
                      alt=""
                    />
                  ) : (
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        backgroundColor: "#3f3f46",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 16,
                        fontWeight: 700,
                      }}
                    >
                      {t.symbol.slice(0, 1)}
                    </div>
                  )}
                  <span>{t.symbol}</span>
                </div>
                <span style={{ fontWeight: 700 }}>${t.usdValue}</span>
              </div>
            ))
          ) : (
            <span style={{ fontSize: 24, color: "#6b7280" }}>No priced holdings found</span>
          )}
        </div>

        <div style={{ display: "flex", marginTop: "auto", fontSize: 20, color: "#6b7280" }}>
          Base Portfolio · castflow-frontend.vercel.app
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    }
  )
}
