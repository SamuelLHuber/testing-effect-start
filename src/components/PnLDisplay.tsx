import { formatPercentage } from "../lib/portfolio-data"

interface PnLDisplayProps {
  realizedGainPercent: number
  unrealizedGainPercent: number
}

export function PnLDisplay(
  { realizedGainPercent, unrealizedGainPercent }: PnLDisplayProps,
) {
  const totalGainPercent = realizedGainPercent + unrealizedGainPercent

  return (
    <div className="space-y-4 p-4 bg-base-100 rounded-lg">
      <div className="text-center">
        <h3 className="font-semibold text-base-content/70 text-sm uppercase tracking-wide mb-3">
          Portfolio Performance
        </h3>
      </div>

      <div className="grid grid-cols-3 gap-4 text-center">
        {/* Realized Gains */}
        <div className="space-y-1">
          <div className="text-xs text-base-content/60 uppercase tracking-wide">
            Realized
          </div>
          <div
            className={`text-lg font-bold ${
              realizedGainPercent >= 0 ? "text-success" : "text-error"
            }`}
          >
            {realizedGainPercent >= 0 ? "+" : ""}
            {formatPercentage(realizedGainPercent)}
          </div>
          <div className="flex items-center justify-center">
            {realizedGainPercent >= 0
              ? (
                <svg
                  className="w-4 h-4 text-success"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )
              : (
                <svg
                  className="w-4 h-4 text-error"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
          </div>
        </div>

        {/* Unrealized Gains */}
        <div className="space-y-1">
          <div className="text-xs text-base-content/60 uppercase tracking-wide">
            Unrealized
          </div>
          <div
            className={`text-lg font-bold ${
              unrealizedGainPercent >= 0 ? "text-success" : "text-error"
            }`}
          >
            {unrealizedGainPercent >= 0 ? "+" : ""}
            {formatPercentage(unrealizedGainPercent)}
          </div>
          <div className="flex items-center justify-center">
            {unrealizedGainPercent >= 0
              ? (
                <svg
                  className="w-4 h-4 text-success"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )
              : (
                <svg
                  className="w-4 h-4 text-error"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
          </div>
        </div>

        {/* Total Performance */}
        <div className="space-y-1">
          <div className="text-xs text-base-content/60 uppercase tracking-wide">
            Total
          </div>
          <div
            className={`text-lg font-bold ${
              totalGainPercent >= 0 ? "text-success" : "text-error"
            }`}
          >
            {totalGainPercent >= 0 ? "+" : ""}
            {formatPercentage(totalGainPercent)}
          </div>
          <div className="flex items-center justify-center">
            {totalGainPercent >= 0
              ? (
                <svg
                  className="w-4 h-4 text-success"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )
              : (
                <svg
                  className="w-4 h-4 text-error"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
          </div>
        </div>
      </div>

      {/* Performance note */}
      <div className="text-center pt-2 border-t border-base-300">
        <p className="text-xs text-base-content/50">
          Performance shown as percentage of total portfolio value
        </p>
      </div>
    </div>
  )
}
