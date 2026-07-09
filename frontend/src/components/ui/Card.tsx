import React from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "glass";
}

export function Card({ children, className, variant = "default", ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl p-6",
        variant === "default" && "bg-white/5 border border-white/10",
        variant === "glass" && "bg-white/10 backdrop-blur-md border border-white/20",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}