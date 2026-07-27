'use client';

import { useEffect, useState } from 'react';

export function SocialProof() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://castflow-backend.onrender.com';
    fetch(`${apiBase}/api/advertiser/slots/open`)
      .then((res) => res.json())
      .then((data) => setCount(Array.isArray(data.slots) ? data.slots.length : 0))
      .catch(() => setCount(null));
  }, []);

  return (
    <div className="bg-black/20 rounded-xl p-4 text-center">
      <p className="text-sm text-text-secondary">
        {count === null ? (
          'Live on Base Sepolia'
        ) : count === 0 ? (
          'Be the first to list a slot'
        ) : (
          `${count} open slot${count === 1 ? '' : 's'} live right now`
        )}
      </p>
    </div>
  );
}
