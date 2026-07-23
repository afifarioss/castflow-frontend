"use client";

import React from "react";
import { Card } from "@/components/ui/Card";

interface FrameEmbedProps {
  frameUrl: string;
  width?: number;
  height?: number;
}

export function FrameEmbed({ frameUrl, width = 400, height = 400 }: FrameEmbedProps) {
  return (
    <Card className="p-0 overflow-hidden" style={{ maxWidth: width }}>
      <iframe
        src={frameUrl}
        width={width}
        height={height}
        className="border-none"
        title="Farcaster Frame"
        sandbox="allow-scripts allow-same-origin"
      />
    </Card>
  );
}