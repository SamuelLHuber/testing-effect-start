import { persisted } from "@effect/experimental/RequestResolver"
import { HttpServerRequest, HttpServerResponse } from "@effect/platform"
import {
  Duration,
  Effect,
  Exit,
  PrimaryKey,
  RequestResolver,
  Schema,
} from "effect"

// Schema for image data
class ImageData extends Schema.Class<ImageData>("ImageData")({
  content: Schema.String,
  contentType: Schema.String,
}) {}

// Request to get cached image
class GetCachedImage
  extends Schema.TaggedRequest<GetCachedImage>()("GetCachedImage", {
    failure: Schema.String,
    success: ImageData,
    payload: {
      address: Schema.String,
    },
  })
{
  [PrimaryKey.symbol]() {
    return `CachedImage:${this.address.toLowerCase()}`
  }
}

// Request to set cached image
class SetCachedImage
  extends Schema.TaggedRequest<SetCachedImage>()("SetCachedImage", {
    failure: Schema.String,
    success: ImageData,
    payload: {
      address: Schema.String,
      svgContent: Schema.String,
    },
  })
{
  [PrimaryKey.symbol]() {
    return `CachedImage:${this.address.toLowerCase()}`
  }
}

// Create resolver with Redis persistence
const imageResolver = RequestResolver.fromEffectTagged<
  GetCachedImage | SetCachedImage
>()({
  GetCachedImage: (reqs) => {
    return Effect.forEach(
      reqs,
      (_req) => Effect.fail("Image not found in cache"),
    )
  },
  SetCachedImage: (reqs) => {
    return Effect.forEach(
      reqs,
      (_req) =>
        Effect.succeed({ content: _req.svgContent, contentType: "svg+xml" }),
    )
  },
}).pipe(
  persisted({
    storeId: "images",
    timeToLive: (_req, exit) => (Exit.isSuccess(exit) ? Duration.days(14) : 0),
  }),
)

// GET method - retrieve cached image or return fallback
export const GET = Effect.gen(function*() {
  const request = yield* HttpServerRequest.HttpServerRequest

  // Extract query parameters from URL
  const queryStart = request.url.indexOf("?")
  const searchParams = queryStart >= 0
    ? new URLSearchParams(request.url.substring(queryStart + 1))
    : new URLSearchParams()

  const address = searchParams.get("address")?.toLowerCase()

  if (!address) {
    return yield* HttpServerResponse.json(
      { error: "Address query parameter is required" },
      { status: 400 },
    )
  }

  // Use resolver to get cached image
  const resolver = yield* imageResolver
  yield* Effect.logInfo("looking for Address:", address)
  // Try to get cached image, fallback to redirect on error
  const response = yield* Effect.request(
    new GetCachedImage({ address }),
    resolver,
  ).pipe(
    Effect.map((imageData) =>
      HttpServerResponse.raw(imageData.content, {
        headers: {
          "Content-Type": imageData.contentType,
          "Cache-Control": "public, max-age=3600", // Cache for 1 hour
        },
      })
    ),
    Effect.orElse(() =>
      // No cached image found, redirect to fallback
      Effect.succeed(HttpServerResponse.raw("", {
        status: 302,
        headers: {
          "Location": "https://dtech.vision/miniapp.png",
        },
      }))
    ),
  )

  return yield* response
})

// POST method - cache new image
export const POST = Effect.gen(function*() {
  const request = yield* HttpServerRequest.HttpServerRequest

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

  const isValidSvg = (hasXmlDeclaration && containsSvgTag && endsWithSvg)
    || (hasDirectSvg && endsWithSvg)

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

  // Use resolver to cache image with error handling
  const resolver = yield* imageResolver
  const _result = yield* Effect.catchAll(
    Effect.request(
      new SetCachedImage({ address, svgContent: trimmedSvg }),
      resolver,
    ),
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
