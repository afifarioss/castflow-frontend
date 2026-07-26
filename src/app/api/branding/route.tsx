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
  const showText = type !== "splash";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0052FF 0%, #855DCD 100%)",
          fontFamily: "Inter, sans-serif",
        }}
      >
        <div
          style={{
            fontSize: type === "icon" ? 140 : type === "splash" ? 64 : 96,
            fontWeight: 800,
            color: "white",
          }}
        >
          {showText ? "CastFlow" : "CF"}
        </div>
      </div>
    ),
    size
  );
}
