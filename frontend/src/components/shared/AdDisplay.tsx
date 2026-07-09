import React from "react";
import { Card } from "@/components/ui/Card";

interface AdDisplayProps {
  creativeUrl: string;
  title?: string;
  castHash?: string;
}

export function AdDisplay({ creativeUrl, title, castHash }: AdDisplayProps) {
  return (
    <Card className="max-w-sm">
      {creativeUrl ? (
        <img
          src={creativeUrl}
          alt={title || "Advertisement"}
          className="w-full h-48 object-cover rounded-lg mb-4"
        />
      ) : (
        <div className="w-full h-48 bg-white/5 rounded-lg mb-4 flex items-center justify-center text-text-secondary">
          No creative
        </div>
      )}
      {title && <h3 className="text-lg font-semibold mb-1">{title}</h3>}
      {castHash && (
        <p className="text-xs text-text-secondary truncate">Cast: {castHash}</p>
      )}
    </Card>
  );
}