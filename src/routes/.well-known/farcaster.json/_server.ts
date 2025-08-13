import { HttpServerResponse } from "@effect/platform"
import { Effect } from "effect"

import getFCmanifest from "../../../lib/farcaster/manifest"

export const GET = Effect.gen(function*() {
  const manifest = getFCmanifest({
    accountAssociationHeader: "",
    accountAssociationPayload: "",
    accountAssociationSignature: "",
  })
  return yield* HttpServerResponse.json(manifest)
})
