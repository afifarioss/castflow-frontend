import type { Metadata } from "next"

interface Props {
  params: { address: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { address } = params
  const imageUrl = `https://castflow-frontend.vercel.app/api/og/portfolio?address=${address}`

  return {
    title: "CastFlow Portfolio",
    description: "View any Base wallet portfolio — read-only, no wallet signature required.",
    openGraph: {
      title: "CastFlow Portfolio",
      description: "View any Base wallet portfolio — read-only, no wallet signature required.",
      images: [{ url: imageUrl, width: 1200, height: 630 }],
    },
    other: {
      "fc:frame": "vNext",
      "fc:frame:image": imageUrl,
      "fc:frame:button:1": "View Portfolio",
      "fc:frame:button:1:action": "link",
      "fc:frame:button:1:target": `https://castflow-frontend.vercel.app/frame`,
    },
  }
}

export default function SharePage({ params }: Props) {
  const { address } = params
  const shortAddress = `${address.slice(0, 6)}...${address.slice(-4)}`
  const shareCastText =
    "I built CastFlow — a simple way to view and share your Base wallet portfolio on Farcaster. Try my portfolio below 🌊"

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center px-4 py-10">
      <div className="text-center max-w-md mb-8">
        <h1 className="text-3xl font-bold mb-2">View any Base wallet portfolio</h1>
        <p className="text-gray-400 text-sm break-all">{shortAddress}</p>
      </div>

      <div className="w-full max-w-md space-y-2 mb-8">
        <div className="flex items-center gap-3 p-3 bg-gray-900 rounded-lg">
          <span className="text-xl">💰</span>
          <span className="text-sm text-gray-300">Live token balances, priced by verified contract</span>
        </div>
        <div className="flex items-center gap-3 p-3 bg-gray-900 rounded-lg">
          <span className="text-xl">👥</span>
          <span className="text-sm text-gray-300">See what your Farcaster frens also hold</span>
        </div>
        <div className="flex items-center gap-3 p-3 bg-gray-900 rounded-lg">
          <span className="text-xl">📤</span>
          <span className="text-sm text-gray-300">Share your portfolio as a cast, one tap</span>
        </div>
      </div>

      <a
        href="https://castflow-frontend.vercel.app/frame"
        className="w-full max-w-md text-center bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-lg font-medium mb-3"
      >
        View your own Base portfolio
      </a>

      <a
        href={`https://warpcast.com/~/compose?text=${encodeURIComponent(shareCastText)}&embeds[]=${encodeURIComponent(`https://castflow-frontend.vercel.app/share/${address}`)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full max-w-md text-center bg-purple-600 hover:bg-purple-500 px-6 py-3 rounded-lg font-medium mb-3"
      >
        Share this portfolio as a cast
      </a>

      <p className="text-xs text-gray-500 text-center mt-4">
        🔒 Read-only. No wallet signature required.
      </p>
    </div>
  )
}
