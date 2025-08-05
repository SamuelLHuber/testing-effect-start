import { useState } from "preact/hooks"
import { formatPercentage, generateChartColors } from "../lib/portfolio-data"
import type { ProcessedPosition } from "../lib/zerion-types"

interface PositionsListProps {
  positions: Array<ProcessedPosition>
  maxItems?: number
}

export function PositionsList({ maxItems = 6, positions }: PositionsListProps) {
  const [showAll, setShowAll] = useState(false)

  if (positions.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-base-content/50 text-sm">
          No positions found
        </div>
      </div>
    )
  }

  const visiblePositions = positions.slice(0, maxItems)
  const hiddenPositions = positions.slice(maxItems)
  const hasHiddenPositions = hiddenPositions.length > 0

  // Calculate "Others" percentage if there are hidden positions
  const othersPercentage = hasHiddenPositions
    ? hiddenPositions.reduce((sum, pos) => sum + pos.percentage, 0)
    : 0

  const colors = generateChartColors(positions.length)
  const displayPositions = showAll ? positions : visiblePositions

  return (
    <div className="space-y-3">
      {displayPositions.map((position, index) => (
        <div
          key={position.symbol}
          className="flex items-center justify-between p-3 rounded-lg bg-base-100 hover:bg-base-200 transition-colors"
        >
          {/* Left side: Icon, symbol, and name */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {/* Color indicator */}
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: colors[index] }}
            />

            {/* Token info */}
            <div className="flex items-center gap-2 min-w-0 flex-1">
              {position.icon ?
                (
                  <img
                    src={position.icon}
                    alt={position.symbol}
                    className="w-6 h-6 rounded-full flex-shrink-0"
                    onError={(e) => {
                      const fallback = document.createElement("div")
                      fallback.className =
                        "w-6 h-6 rounded-full flex-shrink-0 bg-base-300 flex items-center justify-center"
                      fallback.innerHTML =
                        "<span class=\"text-xs text-base-content/50\">?</span>"
                      e.currentTarget.parentNode?.replaceChild(
                        fallback,
                        e.currentTarget,
                      )
                    }}
                  />
                ) :
                (
                  <div className="w-6 h-6 rounded-full flex-shrink-0 bg-base-300 flex items-center justify-center">
                    <span className="text-xs text-base-content/50">?</span>
                  </div>
                )}

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-base-content">
                    {position.symbol}
                  </span>
                  {position.verified && (
                    <svg
                      className="w-4 h-4 text-success flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.238.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
                <div className="text-sm text-base-content/60 truncate">
                  {position.name}
                </div>
              </div>
            </div>
          </div>

          {/* Right side: Percentage */}
          <div className="text-right flex-shrink-0">
            <div className="font-bold text-base-content">
              {formatPercentage(position.percentage)}
            </div>
          </div>
        </div>
      ))}

      {/* Others expandable section */}
      {hasHiddenPositions && !showAll && (
        <div
          className="flex items-center justify-between p-3 rounded-lg bg-base-100 hover:bg-base-200 transition-colors cursor-pointer"
          onClick={() => setShowAll(true)}
        >
          {/* Left side: Others indicator */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {/* Color indicator */}
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: colors[maxItems] || "#64748b" }}
            />

            {/* Others info */}
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-base-content">
                    Others
                  </span>
                  <span className="text-sm text-base-content/60">
                    ({hiddenPositions.length} assets)
                  </span>
                </div>
                <div className="text-sm text-base-content/60">
                  Click to expand
                </div>
              </div>
            </div>
          </div>

          {/* Right side: Percentage and expand icon */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="font-bold text-base-content">
              {formatPercentage(othersPercentage)}
            </div>
            <svg
              className="w-4 h-4 text-base-content/60"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      )}

      {/* Collapse button when showing all */}
      {showAll && hasHiddenPositions && (
        <div className="text-center py-2">
          <button
            onClick={() => setShowAll(false)}
            className="text-sm text-base-content/70 hover:text-base-content transition-colors flex items-center gap-1 mx-auto"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 15l7-7 7 7"
              />
            </svg>
            Show less
          </button>
        </div>
      )}
    </div>
  )
}
