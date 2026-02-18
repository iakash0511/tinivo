import { NextResponse } from 'next/server'


// env (set these on Vercel / your host)
const SHIPROCKET_EMAIL = process.env.SHIPROCKET_EMAIL
const SHIPROCKET_PASSWORD = process.env.SHIPROCKET_PASSWORD
const SHIPROCKET_SOURCE_PINCODE = process.env.SHIPROCKET_SOURCE_PINCODE
const SHIPROCKET_BASE_URL = process.env.SHIPROCKET_BASE_URL || 'https://apiv2.shiprocket.in/v1/external'

// in-memory token cache (serverless may get cold resets — but this reduces auth calls)
let tokenCache: { token?: string; expiresAt?: number } = {}
async function getShiprocketToken() {
  const now = Date.now()
  if (tokenCache.token && tokenCache.expiresAt && tokenCache.expiresAt > now + 5000) {
    return tokenCache.token
  }

  const res = await fetch(`${SHIPROCKET_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: SHIPROCKET_EMAIL,
      password: SHIPROCKET_PASSWORD
    })
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Shiprocket auth failed: ${res.status} ${text}`)
  }
  const json = await res.json() as unknown
  // token is typically at json.token; safely extract from unknown
  const j = json as Record<string, unknown> | null
  const tokenFromRoot = j && typeof j['token'] === 'string' ? (j['token'] as string) : undefined
  const tokenFromData = j && typeof j['data'] === 'object' && j['data'] !== null && typeof (j['data'] as Record<string, unknown>)['token'] === 'string'
    ? ((j['data'] as Record<string, unknown>)['token'] as string)
    : undefined
  const tokenFromId = j && typeof j['token_id'] === 'string' ? (j['token_id'] as string) : undefined
  const token = tokenFromRoot || tokenFromData || tokenFromId
  // Shiprocket token TTL isn't always provided; set a safe expiry (50 min)
  tokenCache = { token, expiresAt: Date.now() + 50 * 60 * 1000 }
  return token
}

export async function POST(request: Request) {

  try {
    const body = await request.json()

    const {
      delivery_postcode,
      weight = 0.5,
      length,
      breadth,
      height,
      cod = 0,
    } = body

    const safeWeight = Math.max(0.1, Number(weight) || 0.5)
    const safeLength = Math.max(10, Number(length) || 0)
    const safeBreadth = Math.max(10, Number(breadth) || 0)
    const safeHeight = Math.max(5, Number(height) || 0)

    if (!delivery_postcode) {
      return NextResponse.json(
        { error: "Missing shipping parameters" },
        { status: 400 }
      )
    }

    if (!SHIPROCKET_EMAIL || !SHIPROCKET_PASSWORD || !SHIPROCKET_SOURCE_PINCODE) {
      return NextResponse.json({ error: 'Shiprocket credentials or source pincode not set on server' }, { status: 500 })
    }

    const token = await getShiprocketToken()


    // Serviceability endpoint expects pickup and delivery pincode and weight
    const serviceUrl =
      `${SHIPROCKET_BASE_URL}/courier/serviceability/?` +
      new URLSearchParams({
        pickup_postcode: SHIPROCKET_SOURCE_PINCODE,
        delivery_postcode,
        weight: String(safeWeight),
        cod: String(cod),
        length: String(safeLength),
        breadth: String(safeBreadth),
        height: String(safeHeight),
      }).toString()

    const sres = await fetch(serviceUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })



    if (!sres.ok) {
      const text = await sres.text()
      console.error('Shiprocket serviceability error', sres.status, text)
      return NextResponse.json({ error: 'Failed to fetch serviceability', details: text }, { status: sres.status })
    }

    const serviceJson = await sres.json()
    // serviceJson typically contains list of couriers with rates; normalize for your client
    // Example shape depends on Shiprocket response; we'll return it under `options` directly
    return NextResponse.json({ ok: true, options: serviceJson }, { status: 200, headers: { 'Cache-Control': 's-maxage=30, stale-while-revalidate=300' } })
  } catch (err: unknown) {
    console.error('shiprocket/rates error', err)
    const message = err && typeof err === 'object' && 'message' in err && typeof (err as { message?: unknown }).message === 'string'
      ? (err as { message?: string }).message
      : undefined
    return NextResponse.json({ error: message || 'Server error' }, { status: 500 })
  }
}
