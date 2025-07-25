// Zerion API TypeScript types

export interface ZerionPosition {
  type: "positions"
  id: string
  attributes: {
    name: string
    position_type: string
    quantity: {
      float: number
      decimals: number
    }
    value: number
    price: number
    changes: {
      absolute_1d: number
      percent_1d: number
    }
    fungible_info: {
      name: string
      symbol: string
      icon: {
        url: string
      }
      flags: {
        verified: boolean
      }
      implementations: Array<{
        chain_id: string
        address: string | null
        decimals: number
      }>
    }
    flags: {
      displayable: boolean
      is_trash: boolean
    }
  }
}

export interface ZerionPositionsResponse {
  links: {
    self: string
  }
  data: Array<ZerionPosition>
}

export interface ZerionPortfolioResponse {
  links: {
    self: string
  }
  data: {
    type: "portfolio"
    id: string
    attributes: {
      positions_distribution_by_type: {
        wallet: number
        deposited: number
        borrowed: number
        locked: number
        staked: number
      }
      positions_distribution_by_chain: Record<string, number>
      total: {
        positions: number
      }
      changes: {
        absolute_1d: number
        percent_1d: number
      }
    }
  }
}

export interface ZerionPnLResponse {
  links: {
    self: string
  }
  data: {
    type: "wallet_pnl"
    id: string
    attributes: {
      realized_gain: number
      unrealized_gain: number
      total_fee: number
      net_invested: number
      received_external: number
      sent_external: number
      sent_for_nfts: number
      received_for_nfts: number
    }
  }
}

// Portfolio visualization types
export interface ProcessedPosition {
  symbol: string
  name: string
  value: number
  percentage: number
  icon: string
  verified: boolean
}

export interface PortfolioData {
  positions: Array<ProcessedPosition>
  topPositions: Array<ProcessedPosition>
  others: ProcessedPosition | null
  totalValue: number
  realizedGainPercent: number
  unrealizedGainPercent: number
}
