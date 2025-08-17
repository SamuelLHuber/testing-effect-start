import { HttpServerResponse } from "@effect/platform"
import { Effect } from "effect"

import getFCmanifest from "../../../lib/farcaster/manifest"

export const GET = Effect.gen(function*() {
  const manifest = getFCmanifest({
    accountAssociationHeader:
      "eyJmaWQiOjE2MDg1LCJ0eXBlIjoiY3VzdG9keSIsImtleSI6IjB4OWQxREIyOTkxY2ZiZWZDMDBiQWI0NEZFNkJmMzE5ZjcxQWM2MDBDZSJ9",
    accountAssociationPayload: "eyJkb21haW4iOiJ6cG9ydC5kdGVjaC5nZyJ9",
    accountAssociationSignature:
      "MHg3OTIxZWMxZGFkYmM5ZjliNjJmODgxNmEzYWI4Y2U2YTdjYzM3NDM2MzRhNGUxZGU1M2U5MWRhNDkyNDdjMmNmNGM0ZjI5MmUyZGUxZjIxOGNhN2I5M2Q4MDU5ZWM2NDA4YjBjMzcxMTdkM2IyZmYxMzM2YWU3OGNlOTU1M2VlNDFj",
    homeUrl: "https://zport.dtech.gg/",
  })
  return yield* HttpServerResponse.json(manifest)
})
