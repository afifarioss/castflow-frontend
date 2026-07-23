import { AuthKitProvider, useProfile } from "@farcaster/auth-kit";

export { AuthKitProvider, useProfile };
```

File: frontend/src/lib/utils.ts

```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const API_BASE = process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:3001";