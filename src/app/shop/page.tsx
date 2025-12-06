// app/shop/page.tsx
import React from "react"
import Link from "next/link"
import Image from "next/image"
import { getSanityClient } from "@/lib/getSanityClient"
import type { Product, ProductPage } from "@/interface/ProductInterface"
import qs from "querystring"
import FilterBar from "@/components/filterBar/FilterBar"

export const revalidate = 60 // ISR

const DEFAULT_PER_PAGE = 24
const MAX_PER_PAGE = 48

type Params = {
  page?: string | string[]
  perPage?: string | string[]
  search?: string | string[]
  category?: string | string[]
  tags?: string | string[]
  min?: string | string[]
  max?: string | string[]
  sort?: string | string[]
  bestseller?: string | string[]
  featured?: string | string[]
  inStock?: string | string[]
}

function toArray(v?: string | string[]) {
  if (!v) return undefined
  return Array.isArray(v) ? v : [v]
}

function buildFilterAndParams(params: {
  search?: string
  category?: string
  tags?: string[]
  min?: number
  max?: number
  bestseller?: boolean
  featured?: boolean
  inStock?: boolean
}) {
  const parts: string[] = []
  const values: Record<string, unknown> = {}

  if (params.search) {
    // name or description match (case-insensitive partial)
    parts.push('(name match $search || description match $search)')
    values.search = `*${params.search}*`
  }

  if (params.category) {
    parts.push('category == $category')
    values.category = params.category
  }

  if (params.tags && params.tags.length > 0) {
    // require any of the tags to be present
    parts.push(`count((tags[])[@ in $tags]) > 0`)
    values.tags = params.tags
  }

  if (typeof params.min === 'number') {
    parts.push('price >= $min')
    values.min = params.min
  }

  if (typeof params.max === 'number') {
    parts.push('price <= $max')
    values.max = params.max
  }

  if (params.bestseller) {
    parts.push('isBestseller == true')
  }

  if (params.featured) {
    parts.push('isFeatured == true')
  }

  if (params.inStock) {
    parts.push('quantity > 0')
  }

  const filter = parts.length > 0 ? parts.join(' && ') : 'true'
  return { filter, values }
}

async function fetchProductsServer(options: {
  page?: number
  perPage?: number
  search?: string
  category?: string
  tags?: string[]
  min?: number
  max?: number
  sort?: string
  bestseller?: boolean
  featured?: boolean
  inStock?: boolean
}): Promise<ProductPage> {
  const client = await getSanityClient()
  const page = Math.max(1, options.page || 1)
  const perPage = Math.min(MAX_PER_PAGE, Math.max(6, options.perPage || DEFAULT_PER_PAGE))
  const offset = (page - 1) * perPage

  const { filter, values } = buildFilterAndParams({
    search: options.search,
    category: options.category,
    tags: options.tags,
    min: options.min,
    max: options.max,
    bestseller: options.bestseller,
    featured: options.featured,
    inStock: options.inStock
  })

  // sort map
  let orderExpr = '_createdAt desc'
  switch (options.sort) {
    case 'price_asc':
      orderExpr = 'price asc'
      break
    case 'price_desc':
      orderExpr = 'price desc'
      break
    case 'bestseller':
      orderExpr = 'isBestseller desc, _createdAt desc'
      break
    case 'featured':
      orderExpr = 'isFeatured desc, _createdAt desc'
      break
    case 'newest':
    default:
      orderExpr = '_createdAt desc'
  }

  const productsQuery = `*[_type == "product" && ${filter}] | order(${orderExpr})[${offset}...${offset + perPage}]{
    _id,
    name,
    price,
    compareAtPrice,
    quantity,
    category,
    tags,
    isBestseller,
    isFeatured,
    "image": images[0].asset->url,
    "slug": slug.current
  }`

  const countQuery = `count(*[_type == "product" && ${filter}])`

  const [products, totalCount] = await Promise.all([
    client.fetch(productsQuery, values) as Promise<Product[]>,
    client.fetch(countQuery, values) as Promise<number>
  ])

  return { products, totalCount }
}

// Small UI helpers
function buildQuery(params: Record<string, unknown>) {
  // remove undefined/null/empty string
  const q: Record<string, string> = {}
  for (const k of Object.keys(params)) {
    const v = params[k]
    if (v === undefined || v === null) continue
    if (typeof v === 'string' && v.trim() === '') continue
    q[k] = String(v)
  }
  const str = qs.stringify(q)
  return str ? `?${str}` : ''
}

export default async function ShopPage({ searchParams }: { searchParams?: Params }) {
  const params: Params = (searchParams as Params) ?? {}

  const page = Math.max(1, Number(Array.isArray(params.page) ? params.page[0] : params.page || "1"))
  const perPage = Math.min(MAX_PER_PAGE, Number(Array.isArray(params.perPage) ? params.perPage[0] : params.perPage || `${DEFAULT_PER_PAGE}`))

  const search = Array.isArray(params.search) ? params.search[0] : params.search
  const category = Array.isArray(params.category) ? params.category[0] : params.category
  const tags = toArray(params.tags)
  const min = params.min ? Number(Array.isArray(params.min) ? params.min[0] : params.min) : undefined
  const max = params.max ? Number(Array.isArray(params.max) ? params.max[0] : params.max) : undefined
  const sort = Array.isArray(params.sort) ? params.sort[0] : params.sort
  const bestseller = params.bestseller === '1' || params.bestseller === 'true'
  const featured = params.featured === '1' || params.featured === 'true'
  const inStock = params.inStock === '1' || params.inStock === 'true'

  const { products, totalCount } = await fetchProductsServer({
    page,
    perPage,
    search,
    category,
    tags,
    min,
    max,
    sort,
    bestseller,
    featured,
    inStock
  })

  const pageCount = Math.max(1, Math.ceil((totalCount || 0) / perPage))
  const isReachingEnd = page >= pageCount

  // Some simple lists for the filter UI — you can fetch these from Sanity too if dynamic
  const CATEGORIES = [
    { label: 'All', value: '' },
    { label: 'Mini Accessories', value: 'mini-accessories' },
    { label: 'Stationery', value: 'stationery' },
    { label: 'Home Decor', value: 'home-decor' },
    { label: 'Gift Set', value: 'gift-set' },
  ]

  const SORTS = [
    { label: 'Newest', value: 'newest' },
    { label: 'Price: Low → High', value: 'price_asc' },
    { label: 'Price: High → Low', value: 'price_desc' },
    { label: 'Bestsellers', value: 'bestseller' },
    { label: 'Featured', value: 'featured' },
  ]

  // base params helper (keeps current filters)
  const baseParams = {
    search,
    category,
    tags: tags ? tags.join(',') : undefined,
    min,
    max,
    sort,
    bestseller: bestseller ? '1' : undefined,
    featured: featured ? '1' : undefined,
    inStock: inStock ? '1' : undefined,
    perPage
  }

  return (
    <main className="min-h-screen bg-softPink px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-heading mb-6 text-center">All Products ✨</h1>

       {/* FilterBar (client) */}
        <FilterBar
          initialSearch={search || ''}
          initialCategory={category || ''}
          initialSort={sort || 'newest'}
          initialMin={min}
          initialMax={max}
          initialBestseller={bestseller}
          initialInStock={inStock}
          perPage={perPage}
          categories={CATEGORIES}
          sorts={SORTS}
        />



        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {products.map((p: Product) => (
            <Link key={p._id} href={`/product/${p.slug}`} className="bg-white rounded-2xl p-3 shadow-sm hover:shadow-md transition relative">
              <div className="relative w-full aspect-square rounded-xl overflow-hidden">
                {p.quantity === 0 && (
                  <div className="absolute left-3 top-3 z-50">
                    <span className="inline-block bg-neutral-dark text-white text-xs font-semibold px-3 py-1 rounded-full">
                      SOLD OUT
                    </span>
                  </div>
                )}

                {p.image ? (
                  <Image src={p.image} alt={p.name} fill sizes="(max-width:768px) 100vw, 25vw" className="object-cover transition-transform duration-300 hover:scale-105" />
                ) : (
                  <div className="w-full h-full bg-neutral-light flex items-center justify-center text-sm text-neutral-500">
                    No image
                  </div>
                )}
              </div>

              <div className="mt-3 text-center flex justify-center flex-col items-center">
                <h3 className="font-heading text-sm md:text-base line-clamp-1">{p.name}</h3>
                <p className="text-primary font-cta font-semibold mt-1 flex gap-2">
                  {p.compareAtPrice ? <span className="line-through text-gray-600">₹{p.compareAtPrice}</span> : null}
                  ₹{p.price}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* pagination */}
        <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Link href={`/shop${buildQuery({ ...baseParams, page: Math.max(1, page - 1) })}`} className={`px-4 py-2 rounded-lg bg-white shadow-sm ${page <= 1 ? "opacity-60 pointer-events-none" : ""}`}>Prev</Link>
            <div className="px-4 py-2 rounded-lg bg-white shadow-sm text-sm">Page {page} of {pageCount || 1}</div>
            <Link href={`/shop${buildQuery({ ...baseParams, page: page + 1 })}`} className={`px-4 py-2 rounded-lg bg-primary text-white font-semibold ${isReachingEnd ? "opacity-60 pointer-events-none" : ""}`}>{isReachingEnd ? "No more" : "Next"}</Link>
          </div>

          <div className="flex items-center gap-3">
            <Link href={`/shop${buildQuery({ ...baseParams, page: 1 })}`} className={`px-4 py-2 rounded-lg bg-white shadow-sm ${page === 1 ? "opacity-60 pointer-events-none" : ""}`}>First</Link>
            <Link href={`/shop${buildQuery({ ...baseParams, page: pageCount })}`} className={`px-4 py-2 rounded-lg bg-white shadow-sm ${isReachingEnd ? "opacity-60 pointer-events-none" : ""}`}>Last</Link>
            <div className="text-sm text-neutral-600">{totalCount ? `${totalCount} products` : ''}</div>
          </div>
        </div>
      </div>
    </main>
  )
}
