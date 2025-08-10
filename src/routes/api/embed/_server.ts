import { HttpServerRequest, HttpServerResponse } from "@effect/platform"
import { Effect } from "effect"

import getFCembed from "../../../lib/farcaster/embed"

export const GET = Effect.gen(function*() {
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

  // TODO: use @dtech farcaster utils for aid on the embed
  const appUrl = `https://${request.headers.host}`
  const imageUrl = `${appUrl}/api/image/address/${address}`
  const miniAppEmbed = getFCembed({
    appUrl,
    imageUrl,
  })

  return yield* HttpServerResponse.html(`
    <html>
      <head>
        <meta>
          <meta name="fc:miniapp" content="${JSON.stringify(miniAppEmbed)}"/>
        </meta>
      </head>
      <body>
        <script>
          window.location.href="/"
        </script>
      </body>
    </html>
  `)
})
