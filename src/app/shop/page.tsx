// app/shop/page.tsx
import React from "react"
import Link from "next/link"
import Image from "next/image"
import { getSanityClient } from "@/lib/getSanityClient"
import { Product, ProductPage } from '@/interface/ProductInterface'

export const revalidate = 60 // cache shop page HTML for 60s

const PRODUCTS_PER_PAGE = 24

async function fetchProducts(page = 1, limit = PRODUCTS_PER_PAGE): Promise<ProductPage> {
  const client = await getSanityClient()
  const offset = (page - 1) * limit

  const productsQuery = `*[_type == "product"] | order(_createdAt desc)[${offset}...${offset + limit}]{
    _id,
    name,
    price,
    compareAtPrice,
    quantity,
    "image": images[0].asset->url,
    "slug": slug.current
  }`

  const countQuery = `count(*[_type == "product"])`

  const [products, totalCount] = await Promise.all([
    client.fetch(productsQuery) as Promise<Product[]>,
    client.fetch(countQuery) as Promise<number>
  ])

  return { products, totalCount }
}

export default async function ShopPage({ searchParams }: { searchParams?: Promise<Record<string, string | string[] | undefined>> }) {
  const params = searchParams ? await searchParams : {}
  const pageParam = params.page as string | string[] | undefined
  const page = Math.max(1, Number(pageParam || "1"))

  const { products, totalCount } = await fetchProducts(page, PRODUCTS_PER_PAGE)
  const pageCount = Math.ceil((totalCount || 0) / PRODUCTS_PER_PAGE)
  const isReachingEnd = page >= pageCount

  return (
    <main className="min-h-screen bg-softPink px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-heading mb-6 text-center">All Products ✨</h1>

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
            <Link href={`/shop?page=${Math.max(1, page - 1)}`} className={`px-4 py-2 rounded-lg bg-white shadow-sm ${page <= 1 ? "opacity-60 pointer-events-none" : ""}`}>Prev</Link>
            <div className="px-4 py-2 rounded-lg bg-white shadow-sm text-sm">Page {page} of {pageCount || 1}</div>
            <Link href={`/shop?page=${page + 1}`} className={`px-4 py-2 rounded-lg bg-primary text-white font-semibold ${isReachingEnd ? "opacity-60 pointer-events-none" : ""}`}>{isReachingEnd ? "No more" : "Next"}</Link>
          </div>

          <div className="flex items-center gap-3">
            <Link href={`/shop?page=1`} className={`px-4 py-2 rounded-lg bg-white shadow-sm ${page === 1 ? "opacity-60 pointer-events-none" : ""}`}>First</Link>
            <Link href={`/shop?page=${pageCount}`} className={`px-4 py-2 rounded-lg bg-white shadow-sm ${isReachingEnd ? "opacity-60 pointer-events-none" : ""}`}>Last</Link>
            <div className="text-sm text-neutral-600">{totalCount ? `${totalCount} products` : ''}</div>
          </div>
        </div>
      </div>
    </main>
  )
}
