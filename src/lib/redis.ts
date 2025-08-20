import * as Redis from "@effect/experimental/Persistence/Redis"

// Simple Redis layer following Effect patterns
// Configuration is handled automatically via environment variables
export const RedisLive = Redis.layerResult({})
