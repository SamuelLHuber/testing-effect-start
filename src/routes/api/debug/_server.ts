import { HttpServerResponse } from "@effect/platform"

export const GET = HttpServerResponse.json({
  message: "Debug endpoint",
  hasZerionApiKey: !!process.env.ZERION_API_KEY,
  apiKeyLength: process.env.ZERION_API_KEY?.length || 0,
  env: process.env.NODE_ENV || "development",
})
