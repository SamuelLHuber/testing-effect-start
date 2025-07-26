import { injected } from "@wagmi/core"
import { createConfig, http } from "wagmi"
import { mainnet, sepolia } from "wagmi/chains"

export const config = createConfig({
  chains: [mainnet, sepolia],
  connectors: [injected()],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http()
  }
})

declare module "wagmi" {
  interface Register {
    config: typeof config
  }
}
