import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { base, baseSepolia } from "wagmi/chains";

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? "";

export const config = getDefaultConfig({
  appName: "CastFlow",
  projectId,
  chains: [base, baseSepolia],
  ssr: true,
});