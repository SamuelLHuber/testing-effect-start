import {
  HttpClient,
  HttpClientRequest,
  HttpClientResponse,
} from "@effect/platform"
import { Config, Data, Effect, Redacted } from "effect"
import type {
  ZerionPnLResponse,
  ZerionPortfolioResponse,
  ZerionPositionsResponse,
} from "./zerion-types"

// Error types for Zerion API client
export class ZerionApiError extends Data.TaggedError("ZerionApiError")<{
  message: string
  status?: number
}> {}

export class ZerionConfigError extends Data.TaggedError("ZerionConfigError")<{
  message: string
}> {}

// Configuration interface
interface ZerionConfig {
  apiKey: string
  baseUrl: string
}

// Default configuration
const DEFAULT_CONFIG: Omit<ZerionConfig, "apiKey"> = {
  baseUrl: "https://api.zerion.io/v1",
}

// Zerion API client class
export class ZerionClient {
  private constructor(private readonly config: ZerionConfig) {}

  static make(apiKey: string): ZerionClient {
    return new ZerionClient({
      ...DEFAULT_CONFIG,
      apiKey,
    })
  }

  // Create HTTP request with auth headers
  private createRequest(path: string): HttpClientRequest.HttpClientRequest {
    return HttpClientRequest.get(`${this.config.baseUrl}${path}`).pipe(
      HttpClientRequest.setHeaders({
        "accept": "application/json",
        "authorization": `Basic ${
          Buffer.from(`${this.config.apiKey}:`).toString("base64")
        }`,
      }),
    )
  }

  // Execute request with error handling
  private executeRequest<T>(
    request: HttpClientRequest.HttpClientRequest,
  ): Effect.Effect<T, ZerionApiError, HttpClient.HttpClient> {
    return Effect.gen(function*() {
      const client = yield* HttpClient.HttpClient

      const response = yield* client.execute(request).pipe(
        Effect.catchTag(
          "RequestError",
          (error) =>
            Effect.fail(
              new ZerionApiError({
                message: `Request failed: ${error.message}`,
              }),
            ),
        ),
        Effect.catchTag("ResponseError", (error) =>
          Effect.fail(
            new ZerionApiError({
              message: `HTTP ${error.status}: ${error.statusText}`,
              status: error.status,
            }),
          )),
      )

      if (!HttpClientResponse.isSuccess(response)) {
        return yield* Effect.fail(
          new ZerionApiError({
            message: `API request failed with status ${response.status}`,
            status: response.status,
          }),
        )
      }

      const data = yield* HttpClientResponse.json(response).pipe(
        Effect.catchTag(
          "ParseError",
          (error) =>
            Effect.fail(
              new ZerionApiError({
                message: `Failed to parse JSON response: ${error.message}`,
              }),
            ),
        ),
      )

      return data as T
    })
  }

  // Get wallet positions
  getPositions(
    address: string,
  ): Effect.Effect<
    ZerionPositionsResponse,
    ZerionApiError,
    HttpClient.HttpClient
  > {
    const request = this.createRequest(
      `/wallets/${address}/positions/?filter[positions]=only_simple&currency=usd&filter[trash]=only_non_trash&sort=value`,
    )
    return this.executeRequest<ZerionPositionsResponse>(request)
  }

  // Get wallet portfolio
  getPortfolio(
    address: string,
  ): Effect.Effect<
    ZerionPortfolioResponse,
    ZerionApiError,
    HttpClient.HttpClient
  > {
    const request = this.createRequest(
      `/wallets/${address}/portfolio?filter[positions]=only_simple&currency=usd`,
    )
    return this.executeRequest<ZerionPortfolioResponse>(request)
  }

  // Get wallet PnL
  getPnL(
    address: string,
  ): Effect.Effect<ZerionPnLResponse, ZerionApiError, HttpClient.HttpClient> {
    const request = this.createRequest(
      `/wallets/${address}/pnl/?currency=usd`,
    )
    return this.executeRequest<ZerionPnLResponse>(request)
  }
}

// Config for Zerion API key (redacted for security)
const ZerionApiKey = Config.redacted("ZERION_API_KEY")

// Layer factory for creating configured ZerionClient
export const ZerionClientLive = Effect
  .gen(function*() {
    const redactedApiKey = yield* ZerionApiKey

    return ZerionClient.make(Redacted.value(redactedApiKey))
  })
  .pipe(Effect.cached)

// Helper function to get client from environment
export const getZerionClient = () => ZerionClientLive

// Service interface for dependency injection
export class ZerionService
  extends Effect.Service<ZerionService>()("ZerionService", {
    effect: ZerionClientLive,
    dependencies: [],
  })
{}
