import * as Redis from "@effect/experimental/Persistence/Redis"

/**
 * Redis connection layer for caching and persistence.
 *
 * Currently uses default connection (localhost:6379) with no authentication.
 * The @effect/experimental/Persistence/Redis library accepts ioredis options
 * but no environment variables are automatically configured.
 *
 * To use environment variables, modify this to use Effect's Config system or process.env.
 */
export const RedisLive = Redis.layerResult({})
