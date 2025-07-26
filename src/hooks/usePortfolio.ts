import { useQuery } from "@tanstack/react-query"
import { processCompletePortfolioData } from "../lib/portfolio-data"
import type { ZerionPnLResponse, ZerionPortfolioResponse, ZerionPositionsResponse } from "../lib/zerion-schemas"

// Fetch positions data
export const usePositions = (address: string | undefined) => {
  return useQuery({
    queryKey: ["positions", address],
    queryFn: async (): Promise<ZerionPositionsResponse> => {
      if (!address) throw new Error("Address is required")

      const response = await fetch(
        `/api/positions?address=${address}&filter[positions]=only_simple&currency=usd&filter[trash]=only_non_trash&sort=value`
      )
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to fetch positions")
      }
      return response.json()
    },
    enabled: !!address,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchInterval: 1000 * 60 * 10 // 10 minutes
  })
}

// Fetch portfolio data
export const usePortfolio = (address: string | undefined) => {
  return useQuery({
    queryKey: ["portfolio", address],
    queryFn: async (): Promise<ZerionPortfolioResponse> => {
      if (!address) throw new Error("Address is required")

      const response = await fetch(
        `/api/portfolio?address=${address}&filter[positions]=only_simple&currency=usd`
      )
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to fetch portfolio")
      }
      return response.json()
    },
    enabled: !!address,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchInterval: 1000 * 60 * 10 // 10 minutes
  })
}

// Fetch PnL data
export const usePnL = (address: string | undefined) => {
  return useQuery({
    queryKey: ["pnl", address],
    queryFn: async (): Promise<ZerionPnLResponse> => {
      if (!address) throw new Error("Address is required")

      const response = await fetch(`/api/pnl?address=${address}&currency=usd`)
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to fetch PnL data")
      }
      return response.json()
    },
    enabled: !!address,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchInterval: 1000 * 60 * 10 // 10 minutes
  })
}

// Combined hook for complete portfolio data
export const useCompletePortfolio = (address: string | undefined) => {
  const positionsQuery = usePositions(address)
  const portfolioQuery = usePortfolio(address)
  const pnlQuery = usePnL(address)

  // Derived state
  const isLoading = positionsQuery.isLoading
    || portfolioQuery.isLoading
    || pnlQuery.isLoading
  const isError = positionsQuery.isError
    || portfolioQuery.isError
    || pnlQuery.isError
  const error = positionsQuery.error || portfolioQuery.error || pnlQuery.error

  // Processed data when all queries are successful
  const processedData = (() => {
    if (!positionsQuery.data || !portfolioQuery.data || !pnlQuery.data) {
      return null
    }

    return processCompletePortfolioData(
      positionsQuery.data,
      portfolioQuery.data,
      pnlQuery.data
    )
  })()

  return {
    // Processed data
    data: processedData,

    // Loading states
    isLoading,
    isError,
    error,

    // Individual query states for granular control
    positions: positionsQuery,
    portfolio: portfolioQuery,
    pnl: pnlQuery,

    // Refetch functions
    refetch: () => {
      positionsQuery.refetch()
      portfolioQuery.refetch()
      pnlQuery.refetch()
    }
  }
}
