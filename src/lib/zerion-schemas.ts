import { Schema } from "effect"

// Position attributes schema (based on existing types)
export const ZerionPositionAttributesSchema = Schema.Struct({
  parent: Schema.Union(Schema.String, Schema.Null),
  protocol: Schema.Union(Schema.String, Schema.Null),
  name: Schema.String,
  position_type: Schema.String,
  quantity: Schema.Struct({
    int: Schema.String,
    decimals: Schema.Number,
    float: Schema.Number,
    numeric: Schema.String,
  }),
  value: Schema.Union(Schema.Number, Schema.Null),
  price: Schema.Number,
  changes: Schema.Union(Schema.Unknown, Schema.Null),
  fungible_info: Schema.Struct({
    name: Schema.String,
    symbol: Schema.String,
    icon: Schema.Union(
      Schema.Struct({
        url: Schema.String,
      }),
      Schema.Null,
    ),
    flags: Schema.Struct({
      verified: Schema.Boolean,
    }),
    implementations: Schema.Array(
      Schema.Struct({
        chain_id: Schema.String,
        address: Schema.Union(Schema.String, Schema.Null),
        decimals: Schema.Number,
      }),
    ),
  }),
  flags: Schema.Struct({
    displayable: Schema.Boolean,
    is_trash: Schema.Boolean,
  }),
  updated_at: Schema.String,
  updated_at_block: Schema.Number,
})

// Position schema
export const ZerionPositionSchema = Schema.Struct({
  type: Schema.Literal("positions"),
  id: Schema.String,
  attributes: ZerionPositionAttributesSchema,
  relationships: Schema.optional(Schema.Struct({
    chain: Schema.Struct({
      links: Schema.Struct({
        related: Schema.String,
      }),
      data: Schema.Struct({
        type: Schema.String,
        id: Schema.String,
      }),
    }),
    fungible: Schema.Struct({
      links: Schema.Struct({
        related: Schema.String,
      }),
      data: Schema.Struct({
        type: Schema.String,
        id: Schema.String,
      }),
    }),
  })),
})

// Positions response schema
export const ZerionPositionsResponseSchema = Schema.Struct({
  links: Schema.Struct({
    self: Schema.String,
  }),
  data: Schema.Array(ZerionPositionSchema),
})

// Portfolio data schema (based on existing types)
export const ZerionPortfolioDataSchema = Schema.Struct({
  type: Schema.String,
  id: Schema.String,
  attributes: Schema.Struct({
    positions_distribution_by_type: Schema.Struct({
      wallet: Schema.Number,
      deposited: Schema.Number,
      borrowed: Schema.Number,
      locked: Schema.Number,
      staked: Schema.Number,
    }),
    positions_distribution_by_chain: Schema.Record({
      key: Schema.String,
      value: Schema.Number,
    }),
    total: Schema.Struct({
      positions: Schema.Number,
    }),
    changes: Schema.Struct({
      absolute_1d: Schema.Number,
      percent_1d: Schema.Number,
    }),
  }),
})

// Portfolio response schema
export const ZerionPortfolioResponseSchema = Schema.Struct({
  links: Schema.Struct({
    self: Schema.String,
  }),
  data: ZerionPortfolioDataSchema,
})

// PnL data schema (flexible since no existing types)
export const ZerionPnLDataSchema = Schema.Struct({
  type: Schema.String, // Can be "wallet_pnl" or other variants
  id: Schema.String,
  attributes: Schema.optional(
    Schema.Record({
      key: Schema.String,
      value: Schema.Union(Schema.Number, Schema.String, Schema.Null),
    }),
  ),
})

// PnL response schema
export const ZerionPnLResponseSchema = Schema.Struct({
  links: Schema.Struct({
    self: Schema.String,
  }),
  data: ZerionPnLDataSchema,
})

// Type exports
export type ZerionPosition = Schema.Schema.Type<typeof ZerionPositionSchema>
export type ZerionPositionsResponse = Schema.Schema.Type<
  typeof ZerionPositionsResponseSchema
>
export type ZerionPortfolioResponse = Schema.Schema.Type<
  typeof ZerionPortfolioResponseSchema
>
export type ZerionPnLResponse = Schema.Schema.Type<
  typeof ZerionPnLResponseSchema
>
