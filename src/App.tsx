import "effect-start/client"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ErrorBoundary, LocationProvider, Router } from "preact-iso"
import { WagmiProvider } from "wagmi"
import { config } from "./config/wagmi"
import { RouteComponents } from "./routes.tsx"

const queryClient = new QueryClient()

export function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <LocationProvider>
          <ErrorBoundary>
            <Router>
              {RouteComponents}
            </Router>
          </ErrorBoundary>
        </LocationProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
