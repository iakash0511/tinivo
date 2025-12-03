// src/lib/getSanityClient.ts
import type { SanityClient } from 'next-sanity'

let cachedClient: SanityClient | null = null

export async function getSanityClient(): Promise<SanityClient> {
  if (cachedClient) return cachedClient

  // Dynamic import reduces dev compilation surface
  const mod = await import('@/lib/sanity.client') // adjust path if needed
  cachedClient = mod.client
  return cachedClient
}
