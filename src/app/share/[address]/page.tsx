import type { Metadata } from "next"

interface Props {
  params: { address: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { address } = params
  const imageUrl = `https://castflow-frontend.vercel.app/api/og/portfolio?address=${address}`

  return {
    title: "CastFlow Portfolio",
    description: "Check out my Base portfolio on CastFlow",
    openGraph: {
      title: "CastFlow Portfolio",
      description: "Check out my Base portfolio on CastFlow",
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
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-2">CastFlow Portfolio</h1>
      <p className="text-gray-400 mb-6 text-sm break-all">{address}</p>
      <a
        href="https://castflow-frontend.vercel.app/frame"
        className="bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-lg font-medium"
      >
        View Live Portfolio
      </a>
    </div>
  )
}
