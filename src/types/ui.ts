export type UserDashboardResponse = {
  tokens: Array<UserToken>
  totalUsdBalance: number
  chains: Array<string>
  chainsIcons: ChainIcons
}

export type UserNftsResponse = {
  nfts: Array<UserNft>
  totalNfts: number
  chains: Array<string>
  chainsIcons: ChainIcons
}

export type UserNft = {
  nft_contract_id: string
  token_id: string
  minter: string | null
  owner: string | null
  base_uri: string | null
  metadata_id: string | null
  title: string
  description: string | null
  media: string | null
  reference: string | null
  reference_blob: Record<string, unknown> | null
  minted_timestamp: string | null
  last_transfer_timestamp: string | null
  price: string | null
  currency: string | null
  chain: string | null
}

export type ChainIcons = { [key: number]: string }

export type UserToken = {
  chain: UserTokenChain
  balances: UserTokenBalance
  meta: UserTokenMeta
}

export interface UserTokenChain {
  chainId?: number // undefined is Near
  chainName: string
  chainIcon?: string
}
export interface UserTokenBalance {
  balance: number
  usdBalance: number
  price?: number
}
export interface UserTokenMeta {
  name: string
  symbol: string
  decimals: number
  tokenIcon?: string
  contractAddress?: string
  isSpam: boolean
}

export interface UserBalanceOptions {
  supportedChains?: Array<number>
  showZeroNative?: boolean
  // USD value to hide as dust.
  hideDust?: number
}

export interface TokenBalance {
  chainId?: number
  tokenAddress: string | null // null for native token
  token: {
    name: string
    symbol: string
    decimals: number
    logoUri: string
  } | null
  balance: string
  fiatBalance: string
  fiatConversion: string
}
