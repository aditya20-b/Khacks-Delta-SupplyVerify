import { getDefaultConfig } from 'connectkit'
import { http, createConfig } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'

export const config = createConfig(getDefaultConfig({
    chains: [sepolia],
    transports: {
        [mainnet.id]: http()
    },
    walletConnectProjectId: '9faf1f0f733603456599249de03ec192',
    appName: "Temeknows",
    appDescription: "B2C and B2B Product which literally tells you everything about your Product"
}))