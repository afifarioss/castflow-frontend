import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title") || "CastFlow Ad";
  const creator = searchParams.get("creator") || "Unknown";

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
          color: "white",
          padding: "40px",
        }}
      >
        <div style={{ fontSize: 64, fontWeight: 800, marginBottom: 20 }}>
          CastFlow
        </div>
        <div style={{ fontSize: 36, fontWeight: 600, opacity: 0.9 }}>
          {title}
        </div>
        <div style={{ fontSize: 24, marginTop: 30, opacity: 0.7 }}>
          by {creator}
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 30,
            right: 40,
            fontSize: 20,
            opacity: 0.6,
          }}
        >
          castflow.xyz
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 600,
    }
  );
}