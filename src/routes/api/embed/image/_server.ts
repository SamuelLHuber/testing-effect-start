import { Persistence } from "@effect/experimental"
import { HttpServerRequest, HttpServerResponse } from "@effect/platform"
import { Effect, Option } from "effect"

// GET method - retrieve cached image or return fallback
export const GET = Effect.gen(function*() {
  const request = yield* HttpServerRequest.HttpServerRequest
  const persistence = yield* Persistence.ResultPersistence

  // Extract query parameters from URL
  const queryStart = request.url.indexOf("?")
  const searchParams = queryStart >= 0
    ? new URLSearchParams(request.url.substring(queryStart + 1))
    : new URLSearchParams()

  const address = searchParams.get("address")

  if (!address) {
    return yield* HttpServerResponse.json(
      { error: "Address query parameter is required" },
      { status: 400 },
    )
  }

  // Try to get cached image from Redis with error handling
  const cacheKey = `image:${address.toLowerCase()}`

  const cachedImage = yield* persistence.get(cacheKey)

  if (Option.isSome(cachedImage)) {
    // Return cached SVG image
    return yield* HttpServerResponse.raw(cachedImage.value, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=3600", // Cache for 1 hour
      },
    })
  }

  // No cached image found or cache error, redirect to fallback
  return yield* HttpServerResponse.raw("", {
    status: 302,
    headers: {
      "Location": "https://dtech.vision/miniapp.png",
    },
  })
})

// POST method - cache new image
export const POST = Effect.gen(function*() {
  const request = yield* HttpServerRequest.HttpServerRequest
  const persistence = yield* Persistence.ResultPersistence
  // Extract query parameters for address
  const queryStart = request.url.indexOf("?")
  const searchParams = queryStart >= 0
    ? new URLSearchParams(request.url.substring(queryStart + 1))
    : new URLSearchParams()

  const address = searchParams.get("address")

  if (!address) {
    return yield* HttpServerResponse.json(
      { error: "Address query parameter is required" },
      { status: 400 },
    )
  }

  // Get SVG data from request body
  const svgData = yield* request.text

  // Validate SVG content
  if (!svgData || typeof svgData !== "string" || svgData.trim().length === 0) {
    return yield* HttpServerResponse.json(
      { error: "SVG data is required" },
      { status: 400 },
    )
  }

  const trimmedSvg = svgData.trim()

  // Check for valid SVG format - either with XML declaration or direct SVG
  const hasXmlDeclaration = trimmedSvg.startsWith("<?xml")
  const hasDirectSvg = trimmedSvg.startsWith("<svg")
  const containsSvgTag = trimmedSvg.includes("<svg")
  const endsWithSvg = trimmedSvg.endsWith("</svg>")

  const isValidSvg = (hasXmlDeclaration && containsSvgTag && endsWithSvg) ||
    (hasDirectSvg && endsWithSvg)

  if (!isValidSvg) {
    return yield* HttpServerResponse.json(
      {
        error:
          "Invalid SVG format - must be a complete SVG element with optional XML declaration",
      },
      { status: 400 },
    )
  }

  // Basic size check to prevent extremely large SVG payloads (1MB limit)
  if (trimmedSvg.length > 1024 * 1024) {
    return yield* HttpServerResponse.json(
      { error: "SVG data too large - maximum 1MB allowed" },
      { status: 413 },
    )
  }

  // Store in cache permanently (no TTL) - updates triggered from frontend
  const cacheKey = `image:${address.toLowerCase()}`

  // Store in cache permanently (no TTL) with error handling
  yield* Effect.catchAll(
    persistence.set(cacheKey, trimmedSvg, Option.none()),
    (error) =>
      Effect.gen(function*() {
        yield* Effect.logError(
          `Failed to cache image for ${address}: ${error}`,
        )
        return yield* HttpServerResponse.json(
          { success: false, message: "Failed to cache image" },
          { status: 500 },
        )
      }),
  )

  return yield* HttpServerResponse.json(
    { success: true, message: "Image cached successfully" },
    { status: 200 },
  )
})
