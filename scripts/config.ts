/**
 * Shared config for Payload API automation scripts.
 * Set PAYLOAD_API_URL and PAYLOAD_API_KEY in env (or .env).
 */
export const getPayloadApiConfig = () => {
  const baseURL = process.env.PAYLOAD_API_URL ?? 'http://localhost:3000'
  const apiKey = process.env.PAYLOAD_API_KEY ?? ''
  const authCollectionSlug = 'users'
  const authHeader =
    apiKey.length > 0 ? `${authCollectionSlug} API-Key ${apiKey}` : undefined
  return { baseURL, apiKey, authHeader }
}

export type PayloadApiConfig = ReturnType<typeof getPayloadApiConfig>
