import type {
  ChainData,
  FungibleOptions,
  FungibleTokenData,
  NFTPosition,
  NFTPositionOptions,
  PortfolioData,
  PositionData,
  UserBalanceOptions,
  UserDashboardResponse,
} from "."

// Interface for the Zerion API
export interface iZerionAPI {
  // Add UI property
  readonly ui: iZerionUI

  /**
   * Fetches all supported blockchain chains from Zerion.
   * @param useStatic Instruct the function to not fetch chain or native asset data.
   * @returns A promise resolving to an array of chains supported by Zerion.
   */
  getChains(useStatic?: boolean): Promise<Array<ChainData>>

  /**
   * Fetches the portfolio of a specific wallet, partitioned by network.
   * @param walletAddress The wallet address whose portfolio will be fetched.
   * @param currency Optional currency code to get portfolio values (e.g., 'usd').
   * @returns A promise resolving to the portfolio data for the wallet.
   */
  getPortfolio(
    walletAddress: string,
    currency?: string,
  ): Promise<PortfolioData>

  /**
   * Fetches the fungible token positions of a specific wallet.
   * @param walletAddress The wallet address whose fungible positions will be fetched.
   * @param options Optional options for the request.
   * @returns A promise resolving to the wallet's fungible token positions.
   */
  getFungiblePositions(
    walletAddress: string,
    options?: FungibleOptions,
  ): Promise<Array<PositionData>>

  /**
   * Fetches the NFT positions of a specific wallet.
   * @param walletAddress The wallet address whose NFT positions will be fetched.
   * @param options Optional options for the request.
   * @returns A promise resolving to the wallet's NFT positions.
   */
  fetchNFTs(
    walletAddress: string,
    options?: NFTPositionOptions,
  ): Promise<Array<NFTPosition>>

  /**
   * Fetches native token data.
   * @param chains Chain data obtained from ZerionAPI.getChains.
   * @param useStatic Instruct the function to not fetch chain or native asset data.
   * @returns A promise resolving to a lookup for native assets by chain ID.
   */
  getNativeTokens(
    chains: Array<ChainData>,
    useStatic?: boolean,
  ): Promise<Record<string, FungibleTokenData>>
}

export interface iZerionUI {
  /**
   * Fetches and transforms a wallet's balances into a dashboard-friendly format.
   * Includes chain information, token balances, and USD values.
   * @param walletAddress The wallet address to fetch balances for
   * @param params Optional configuration parameters
   * @param params.fungibleOptions Options for fungible token fetching
   * @param params.options Options for balance formatting and filtering
   * @param params.useStatic If true, uses static data instead of fetching from API
   * @returns A promise resolving to the formatted dashboard response
   */
  getUserBalances(
    walletAddress: string,
    params?: {
      fungibleOptions?: FungibleOptions
      options?: UserBalanceOptions
      useStatic?: boolean
    },
  ): Promise<UserDashboardResponse>
}
