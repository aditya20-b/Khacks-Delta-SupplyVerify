import { defineChain } from "viem";
import { http, cookieStorage, createConfig, createStorage } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import { coinbaseWallet, injected, walletConnect } from "wagmi/connectors";

export const temeknowsChain = defineChain({
  id: 1,
  name: "Delta",
  nativeCurrency: {
    name: "Delta",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: [process.env.RPC_URL as string],
    },
  },
});

export function getConfig() {
  return createConfig({
    chains: [temeknowsChain],
    connectors: [
      injected(),
      coinbaseWallet(),
      walletConnect({
        projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID as string,
      }),
    ],
    storage: createStorage({
      storage: cookieStorage,
    }),
    ssr: true,
    transports: {
      [temeknowsChain.id]: http("http://127.0.0.1:8545"),
    },
  });
}

declare module "wagmi" {
  interface Register {
    config: ReturnType<typeof getConfig>;
  }
}
