import "effect-start/client"
import { ErrorBoundary, LocationProvider, Router } from "preact-iso"
import { WagmiProvider } from "wagmi"
import { config } from "./config/wagmi"
import { RouteComponents } from "./routes.tsx"

export function App() {
  return (
    <WagmiProvider config={config}>
      <LocationProvider>
        <ErrorBoundary>
          <Router>
            {RouteComponents}
          </Router>
        </ErrorBoundary>
      </LocationProvider>
    </WagmiProvider>
  )
}
