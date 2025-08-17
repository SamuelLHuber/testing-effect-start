import { farcasterFrame as miniapp } from "@farcaster/miniapp-wagmi-connector"
import { injected } from "@wagmi/core"
import { createConfig, http } from "wagmi"
import { base } from "wagmi/chains"

export const config = createConfig({
  chains: [base],
  connectors: [injected(), miniapp()],
  transports: {
    [base.id]: http(),
  },
})

declare module "wagmi" {
  interface Register {
    config: typeof config
  }
}
