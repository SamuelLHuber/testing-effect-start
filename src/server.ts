import { Layer } from "effect"
import { BunTailwindPlugin, Start } from "effect-start"

export default Layer.mergeAll(
  // Start.router(() => import("./routes/_manifest")),
  Start.bundleClient({
    entrypoints: ["src/index.html"],
    plugins: [BunTailwindPlugin.make()],
    external: ["@farcaster/miniapp-sdk"],
  }),
)

if (import.meta.main) {
  Start.serve(() => import("./server"))
}
