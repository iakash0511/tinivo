// app/api/products/route.ts
import { NextResponse } from 'next/server'
import { client } from '@/lib/sanity.client'

// Simple GROQ slice: adjust projection fields to match your schema
const buildQuery = (offset: number, limit: number) => `
*[_type == "product"] | order(_createdAt desc)[${offset}...${offset + limit}]{
   _id,
    name,
    price,
    "slug": slug.current,
    compareAtPrice,
    quantity,
    "image": images[0].asset->url,
    category,
    isBestseller
}
`

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const page = Math.max(1, Number(url.searchParams.get('page')) || 1)
    const limit = Math.max(1, Math.min(100, Number(url.searchParams.get('limit')) || 24))
    const offset = (page - 1) * limit

    const products = await client.fetch(buildQuery(offset, limit))

    // Optional: return total count so client can compute number of pages
    const totalCount = await client.fetch(`count(*[_type == "product"])`)

    // Cache on CDN (s-maxage) and allow stale while revalidate
    const headers = {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
    }

    return NextResponse.json({ products, page, limit, totalCount }, { status: 200, headers })
  } catch (err) {
    console.error('api/products error', err)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}
