export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

export const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
