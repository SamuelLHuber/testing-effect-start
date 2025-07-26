import { type ComponentChildren, createContext } from "preact"
import { useContext, useEffect, useState } from "preact/hooks"

interface MiniAppContextValue {
  isReady: boolean
  error: string | null
}

const MiniAppContext = createContext<MiniAppContextValue | null>(null)

interface MiniAppProviderProps {
  children: ComponentChildren
}

export function MiniAppProvider({ children }: MiniAppProviderProps) {
  const [isReady, setIsReady] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window === "undefined") {
      return
    }

    const initializeMiniApp = async () => {
      try {
        // Use require() instead of import() for better compatibility
        const miniappSdk = (globalThis as any).require
          ? (globalThis as any).require("@farcaster/miniapp-sdk")
          : await new Function("return import(\"@farcaster/miniapp-sdk\")")()

        const sdk = miniappSdk.sdk || miniappSdk.default?.sdk
        if (sdk && sdk.actions && sdk.actions.ready) {
          sdk.actions.ready()
          setIsReady(true)
        } else {
          throw new Error("SDK not properly loaded")
        }
      } catch (err) {
        console.error("Failed to initialize MiniApp SDK:", err)
        setError(
          err instanceof Error ? err.message : "Failed to load MiniApp SDK"
        )
      }
    }

    initializeMiniApp()
  }, [])

  const contextValue: MiniAppContextValue = {
    isReady,
    error
  }

  return (
    <MiniAppContext.Provider value={contextValue}>
      {children}
    </MiniAppContext.Provider>
  )
}

export function useMiniApp(): MiniAppContextValue {
  const context = useContext(MiniAppContext)
  if (!context) {
    throw new Error("useMiniApp must be used within a MiniAppProvider")
  }
  return context
}
