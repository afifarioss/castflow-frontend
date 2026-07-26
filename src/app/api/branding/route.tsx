import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

const SIZES: Record<string, { width: number; height: number }> = {
  icon: { width: 512, height: 512 },
  splash: { width: 200, height: 200 },
  preview: { width: 1200, height: 630 },
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") || "icon";
  const size = SIZES[type] || SIZES.icon;

  const isIcon = type === "icon";
  const isSplash = type === "splash";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0052FF 0%, #855DCD 100%)",
          fontFamily: "Inter, sans-serif",
        }}
      >
        {isIcon ? (
          <div style={{ fontSize: 220, fontWeight: 800, color: "white" }}>
            CF
          </div>
        ) : isSplash ? (
          <div style={{ fontSize: 40, fontWeight: 800, color: "white" }}>
            CastFlow
          </div>
        ) : (
          <>
            <div style={{ fontSize: 72, fontWeight: 800, color: "white" }}>
              CastFlow
            </div>
            <div style={{ fontSize: 28, color: "white", opacity: 0.85, marginTop: 16 }}>
              Sell sponsored cast slots on Farcaster
            </div>
          </>
        )}
      </div>
    ),
    size
  );
}
