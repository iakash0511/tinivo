// app/api/product/[slug]/route.ts
import { NextResponse } from 'next/server'
import { client } from '@/lib/sanity.client'
import { productBySlugQuery } from '@/lib/queries'

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  const { slug } = params

  try {
    const product = await client.fetch(productBySlugQuery, { slug })
    if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    // Cache on CDN / Vercel edge for 60s and allow stale while revalidate for 5 minutes
    const headers = {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
    }
    return NextResponse.json(product, { status: 200, headers })
  } catch (err) {
    console.error('Sanity fetch error', err)
    return NextResponse.json({ error: 'Fetch failed' }, { status: 500 })
  }
}
