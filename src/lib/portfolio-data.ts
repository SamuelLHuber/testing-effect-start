import type {
  ZerionPnLResponse,
  ZerionPortfolioResponse,
  ZerionPositionsResponse,
} from "./zerion-schemas"
import type { PortfolioData, ProcessedPosition } from "./zerion-types"

// Process Zerion positions data into chart-ready format
export function processPositionsData(
  positionsResponse: ZerionPositionsResponse,
  portfolioResponse: ZerionPortfolioResponse,
): Array<ProcessedPosition> {
  const totalValue = portfolioResponse.data.attributes.total.positions

  if (totalValue === 0) {
    return []
  }

  return positionsResponse
    .data
    .filter((position) =>
      position.attributes.flags.displayable
      && !position.attributes.flags.is_trash
      && position.attributes.value !== null
    )
    .map((position) => ({
      symbol: position.attributes.fungible_info.symbol,
      name: position.attributes.fungible_info.name,
      value: position.attributes.value!,
      percentage: (position.attributes.value! / totalValue) * 100,
      icon: position.attributes.fungible_info.icon?.url || "",
      verified: position.attributes.fungible_info.flags.verified,
    }))
    .sort((a, b) => b.value - a.value) // Sort by value descending
}

// Group positions into top 6 + others
export function groupPositionsForChart(positions: Array<ProcessedPosition>): {
  topPositions: Array<ProcessedPosition>
  others: ProcessedPosition | null
} {
  if (positions.length <= 6) {
    return {
      topPositions: positions,
      others: null,
    }
  }

  const topSix = positions.slice(0, 6)
  const remaining = positions.slice(6)

  const othersValue = remaining.reduce((sum, pos) => sum + pos.value, 0)
  const othersPercentage = remaining.reduce(
    (sum, pos) => sum + pos.percentage,
    0,
  )

  const others: ProcessedPosition = {
    symbol: "OTHERS",
    name: "Others",
    value: othersValue,
    percentage: othersPercentage,
    icon: "", // No icon for others
    verified: true,
  }

  return {
    topPositions: topSix,
    others,
  }
}

// Calculate PnL percentages relative to total portfolio value
export function processPnLData(
  pnlResponse: ZerionPnLResponse,
  totalValue: number,
): {
  realizedGainPercent: number
  unrealizedGainPercent: number
} {
  if (totalValue === 0) {
    return {
      realizedGainPercent: 0,
      unrealizedGainPercent: 0,
    }
  }

  const attributes = pnlResponse.data.attributes ?? {}
  const realizedGain = typeof attributes.realized_gain === "number"
    ? attributes.realized_gain
    : 0
  const unrealizedGain = typeof attributes.unrealized_gain === "number"
    ? attributes.unrealized_gain
    : 0

  return {
    realizedGainPercent: (realizedGain / totalValue) * 100,
    unrealizedGainPercent: (unrealizedGain / totalValue) * 100,
  }
}

// Combine all data processing into a single function
export function processCompletePortfolioData(
  positionsResponse: ZerionPositionsResponse,
  portfolioResponse: ZerionPortfolioResponse,
  pnlResponse: ZerionPnLResponse,
): PortfolioData {
  const totalValue = portfolioResponse.data.attributes.total.positions

  // Process positions
  const positions = processPositionsData(positionsResponse, portfolioResponse)
  const { others, topPositions } = groupPositionsForChart(positions)

  // Process PnL
  const { realizedGainPercent, unrealizedGainPercent } = processPnLData(
    pnlResponse,
    totalValue,
  )

  return {
    positions,
    topPositions,
    others,
    totalValue,
    realizedGainPercent,
    unrealizedGainPercent,
  }
}

// Generate colors for chart segments
export function generateChartColors(count: number): Array<string> {
  // Professional color palette suitable for financial data
  const baseColors = [
    "#3B82F6", // Blue
    "#10B981", // Green
    "#F59E0B", // Yellow
    "#EF4444", // Red
    "#8B5CF6", // Purple
    "#06B6D4", // Cyan
    "#6B7280", // Gray (for Others)
  ]

  // Return colors up to the count needed
  return baseColors.slice(0, count)
}

// Format percentage for display
export function formatPercentage(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`
}

// Format value for display (if needed for tooltips, etc)
export function formatValue(value: number): string {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(2)}M`
  }
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(2)}K`
  }
  return `$${value.toFixed(2)}`
}
