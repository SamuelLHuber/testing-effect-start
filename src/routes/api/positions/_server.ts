import { HttpServerRequest, HttpServerResponse } from "@effect/platform"
import { Effect, Schema } from "effect"
import { zerionFetch } from "../../../lib/zerion-fetch"
import { ZerionPositionsResponseSchema } from "../../../lib/zerion-schemas"

export const GET = Effect
  .gen(function*() {
    const request = yield* HttpServerRequest.HttpServerRequest

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

    // Forward remaining query parameters to Zerion
    const forwardParams = new URLSearchParams(searchParams)
    forwardParams.delete("address") // Remove address from forwarded params
    const queryString = forwardParams.toString()

    const zerionPath = `/v1/wallets/${address}/positions/${
      queryString ? `?${queryString}` : ""
    }`

    const rawData = yield* zerionFetch(zerionPath)

    // Validate response with schema
    const validatedData = yield* Schema.decodeUnknown(
      ZerionPositionsResponseSchema,
    )(rawData)

    return yield* HttpServerResponse.json(validatedData)
  })
  .pipe(
    Effect.catchAll((error: Error) =>
      HttpServerResponse.json(
        { error: error.message },
        { status: 500 },
      )
    ),
  )
