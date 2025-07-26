import { useAccount } from "wagmi"
import { DonutChart } from "../components/DonutChart"
import { PnLDisplay } from "../components/PnLDisplay"
import { PositionsList } from "../components/PositionsList"
import { ShareButton } from "../components/ShareButton"
import { Wallet } from "../components/Wallet"
import { useCompletePortfolio } from "../hooks/usePortfolio"

export default function() {
  const { address, isConnected } = useAccount()
  const { data: portfolioData, error, isError, isLoading } =
    useCompletePortfolio(address)

  const handleShare = () => {
    // TODO: Implement share functionality
    console.log("Share portfolio")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-300 to-base-100 p-4">
      <div className="container mx-auto max-w-2xl">
        {/* Header with share button */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-base-content">
            Portfolio Overview
          </h1>
          {isConnected && portfolioData && (
            <ShareButton
              onShare={handleShare}
            />
          )}
        </div>

        {/* Wallet connection */}
        {!isConnected
          ? (
            <div className="text-center py-12">
              <Wallet />
            </div>
          )
          : (
            <div className="space-y-6">
              {/* Portfolio visualization */}
              {isLoading
                ? (
                  <div className="text-center py-12">
                    <div className="loading loading-spinner loading-lg mb-4">
                    </div>
                    <p className="text-base-content/60">
                      Loading portfolio data...
                    </p>
                  </div>
                )
                : isError
                ? (
                  <div className="text-center py-12">
                    <div className="alert alert-error max-w-md mx-auto">
                      <svg
                        className="stroke-current shrink-0 h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>
                        {error?.message || "Failed to load portfolio data"}
                      </span>
                    </div>
                    <button
                      className="btn btn-outline btn-sm mt-4"
                      onClick={() => window.location.reload()}
                    >
                      Try Again
                    </button>
                  </div>
                )
                : portfolioData
                ? (
                  <>
                    {/* Donut Chart */}
                    <div className="flex justify-center">
                      <DonutChart
                        positions={[
                          ...portfolioData.topPositions,
                          ...(portfolioData.others
                            ? [portfolioData.others]
                            : []),
                        ]}
                        size={280}
                        strokeWidth={45}
                      />
                    </div>

                    {/* PnL Display */}
                    <PnLDisplay
                      realizedGainPercent={portfolioData.realizedGainPercent}
                      unrealizedGainPercent={portfolioData
                        .unrealizedGainPercent}
                    />

                    {/* Positions List */}
                    <div className="bg-base-200 rounded-lg pt-6 pb-4 px-4">
                      <h2 className="text-lg font-semibold text-base-content mb-4 text-center">
                        Holdings Breakdown
                      </h2>
                      <PositionsList positions={portfolioData.positions} />
                    </div>

                    {/* Wallet info footer */}
                    <div className="text-center py-4 border-t border-base-300">
                      <div className="text-xs text-base-content/50 mb-2">
                        Connected Wallet
                      </div>
                      <div className="font-mono text-sm text-base-content/70">
                        {address?.slice(0, 6)}...{address?.slice(-4)}
                      </div>
                      <button
                        className="btn btn-ghost btn-xs mt-2"
                        onClick={() => {
                          // This will trigger wallet disconnect
                          const walletComponent = document.querySelector(
                            "[data-testid=\"wallet-disconnect\"]",
                          ) as HTMLButtonElement
                          walletComponent?.click()
                        }}
                      >
                        Disconnect
                      </button>
                    </div>
                  </>
                )
                : (
                  <div className="text-center py-12">
                    <div className="text-base-content/60">
                      No portfolio data found for this wallet
                    </div>
                  </div>
                )}
            </div>
          )}
      </div>
    </div>
  )
}
