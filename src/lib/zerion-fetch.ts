import { Config, Effect, Redacted, Schedule, Schema } from "effect"

// Simple retry configuration
const retrySchedule = Schedule.exponential("100 millis").pipe(
  Schedule.intersect(Schedule.recurs(3)),
)

// Zerion API configuration
const ZERION_BASE_URL = "https://api.zerion.io"

// Config for Zerion API key (redacted for security)
const ZerionApiKey = Config.redacted("ZERION_API_KEY")

// Effect-wrapped fetch with retries and validation
export const zerionFetch = (path: string) =>
  Effect
    .gen(function*() {
      const redactedApiKey = yield* ZerionApiKey

      const url = `${ZERION_BASE_URL}${path}`

      // Log the request for debugging
      yield* Effect.logInfo(`[Zerion API] Requesting: ${url}`)

      // Effect-wrapped fetch call
      const response = yield* Effect.tryPromise({
        try: () =>
          fetch(url, {
            headers: {
              "accept": "application/json",
              "authorization": `Basic ${
                Buffer.from(`${Redacted.value(redactedApiKey)}:`).toString(
                  "base64",
                )
              }`,
            },
          }),
        catch: (error) => new Error(`Network error: ${String(error)}`),
      })

      if (!response.ok) {
        // Try to get error details from response body
        const errorText = yield* Effect.tryPromise({
          try: () => response.text(),
          catch: () => "Unable to read error response",
        })

        Effect.logError(`[Zerion API] Error response: ${errorText}`)

        return yield* Effect.fail(
          new Error(
            `Zerion API error: ${response.status} ${response.statusText} - ${errorText}`,
          ),
        )
      }

      // Check if response has content
      const responseText = yield* Effect.tryPromise({
        try: () => response.text(),
        catch: (error) =>
          new Error(`Failed to read response: ${String(error)}`),
      })

      yield* Effect.logInfo(
        `[Zerion API] Response length: ${responseText.length}`,
      )
      // yield* Effect.logInfo(
      //   `[Zerion API] Response preview: ${responseText.slice(0, 200)}...`
      // )

      if (!responseText || responseText.trim() === "") {
        return yield* Effect.fail(
          new Error(`Empty response from Zerion API for: ${url}`),
        )
      }

      // Parse JSON using Schema for proper Effect integration
      const data = yield* Schema
        .decodeUnknown(Schema.parseJson())(responseText)
        .pipe(
          Effect.mapError((error) =>
            new Error(
              `JSON parse error for response "${
                responseText.slice(0, 100)
              }...": ${error.message}`,
            )
          ),
        )

      return data
    })
    .pipe(
      Effect.retry(retrySchedule),
      Effect.timeout("10 seconds"),
    )

// Schema validation helpers
export const validateResponse =
  <A>(schema: Schema.Schema<A, unknown>) =>
  (data: unknown): Effect.Effect<A, Error> => Schema.decode(schema)(data)
