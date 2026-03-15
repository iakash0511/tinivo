import { NextResponse } from 'next/server'

// In-memory token cache
let tokenCache: { token?: string; expiresAt?: number } = {}

interface ShiprocketAuthResponse {
  token: string;
}

interface ShiprocketErrorResponse {
  message?: string;
  error?: string;
}

async function getShiprocketToken(): Promise<string> {
  const EMAIL = process.env.SHIPROCKET_EMAIL;
  const PASSWORD = process.env.SHIPROCKET_PASSWORD;

  if (!EMAIL || !PASSWORD) {
    throw new Error('SHIPROCKET_EMAIL or SHIPROCKET_PASSWORD is not set in the environment variables.');
  }

  const now = Date.now()
  if (tokenCache.token && tokenCache.expiresAt && tokenCache.expiresAt > now + 5000) {
    return tokenCache.token
  }

  const res = await fetch('https://apiv2.shiprocket.in/v1/external/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: EMAIL,
      password: PASSWORD
    })
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Shiprocket auth failed (${res.status}): ${text}`);
  }

  const json = (await res.json()) as ShiprocketAuthResponse;

  if (!json.token) {
    throw new Error('Shiprocket auth succeeded but did not return a token.');
  }

  // Set safe expiry to 50 minutes (Shiprocket tokens generally last 1-10 days depending on config, but 50min is safe for serverless)
  tokenCache = { token: json.token, expiresAt: Date.now() + 50 * 60 * 1000 }
  return json.token
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Provide sensible defaults strictly based on average apparel box
    const {
      delivery_postcode,
      weight = 0.5,
      length = 10,
      breadth = 10,
      height = 5,
      cod = 0,
    } = body

    if (!delivery_postcode) {
      return NextResponse.json(
        { error: "Missing required parameter: delivery_postcode" },
        { status: 400 }
      )
    }

    const SOURCE_PINCODE = process.env.SHIPROCKET_SOURCE_PINCODE;

    if (!SOURCE_PINCODE) {
      return NextResponse.json(
        { error: 'SHIPROCKET_SOURCE_PINCODE not set in the server environment configuration' },
        { status: 500 }
      )
    }

    const token = await getShiprocketToken()

    // Serviceability endpoint expects pickup and delivery pincode and weight
    const serviceUrl =
      "https://apiv2.shiprocket.in/v1/external/courier/serviceability/?" +
      new URLSearchParams({
        pickup_postcode: SOURCE_PINCODE,
        delivery_postcode: String(delivery_postcode),
        weight: String(weight),
        cod: String(cod),
        length: String(length),
        breadth: String(breadth),
        height: String(height),
      }).toString()

    const sres = await fetch(serviceUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })

    if (!sres.ok) {
      let errorDetails = await sres.text();
      try {
        const parsed = JSON.parse(errorDetails) as ShiprocketErrorResponse;
        if (parsed.message || parsed.error) {
          errorDetails = parsed.message || parsed.error || errorDetails;
        }
      } catch (e) {
        // Not a JSON error
      }
      console.error(`Shiprocket serviceability error (${sres.status}):`, errorDetails)
      return NextResponse.json(
        { error: 'Failed to fetch shipping rates from provider', details: errorDetails }, 
        { status: sres.status }
      )
    }

    const serviceJson = await sres.json()
    
    // Return the response, with caching headers so identical requests within 5min hit cache on Edge/Vercel
    return NextResponse.json(
      { ok: true, options: serviceJson }, 
      { 
        status: 200, 
        headers: { 
          'Cache-Control': 's-maxage=30, stale-while-revalidate=300' 
        } 
      }
    )
  } catch (err: unknown) {
    console.error('shiprocket/rates error:', err)
    let message = 'Server error during shipping calculation';
    if (err instanceof Error) {
      message = err.message;
    }
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
