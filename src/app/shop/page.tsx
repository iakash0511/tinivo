'use client'

import useSWRInfinite from 'swr/infinite'
import Image from 'next/image'
import Link from 'next/link'
import { useMemo } from 'react'

const fetcher = (url: string) => fetch(url).then(res => {
  if (!res.ok) throw new Error('Fetch failed')
  return res.json()
})

// Key generator for useSWRInfinite
const getKey = (pageIndex: number, previousPageData: any, limit = 24) => {
  // If previous page is empty, we reached the end
  if (previousPageData && previousPageData.products && previousPageData.products.length === 0) return null
  const page = pageIndex + 1
  return `/api/products?page=${page}&limit=${limit}`
}

export default function ShopPageClient() {
  const limit = 24

  const { data, error, size, setSize, isValidating } = useSWRInfinite(
    (index, prev) => getKey(index, prev, limit),
    fetcher,
    {
      revalidateFirstPage: false,
      revalidateOnFocus: false, 
      dedupingInterval: 60000
    }
  )

  const pages = data ?? []
  const products = useMemo(() => pages.flatMap(p => p.products || []), [pages])
  const totalCount = pages[0]?.totalCount ?? 0
  const pageCount = Math.ceil((totalCount || 0) / limit)

  const isLoadingInitial = !data && !error
  const isLoadingMore = isLoadingInitial || (size > 0 && data && typeof data[size - 1] === 'undefined')
  const isReachingEnd = data && data[data.length - 1] && data[data.length - 1].products.length < limit

  return (
    <main className="min-h-screen bg-softPink px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-heading mb-6 text-center">All Products ✨</h1>
        {error && (
          <div className="text-center text-red-500 mb-4">Failed to load products. Try again later.</div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {products.map((p: any) => (
            <Link
              key={p._id}
              href={`/product/${p.slug}`}
              className="bg-white rounded-2xl p-3 shadow-sm hover:shadow-md transition relative"
            >
              <div className="relative w-full aspect-square rounded-xl overflow-hidden">
                {p.quantity === 0 && (
                  <div className="absolute left-3 top-3 z-50">
                    <span className="inline-block bg-neutral-dark text-white text-xs font-semibold px-3 py-1 rounded-full">
                      SOLD OUT
                    </span>
                  </div>
                )}
                <Image
                  src={p.image}
                  alt={p.name}
                  fill
                  sizes="(max-width:768px) 100vw, 25vw"
                  className={`object-cover transition-transform duration-300 hover:scale-105`}
                />
              </div>

              <div className="mt-3 text-center flex justify-center flex-col items-center">
                <h3 className="font-heading text-sm md:text-base line-clamp-1">{p.name}</h3>
                <p className="text-primary font-cta font-semibold mt-1 flex gap-2">
                  <span className="line-through text-gray-600">₹{p?.compareAtPrice}</span>
                  ₹{p.price}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* pagination / load more controls */}
        <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSize(Math.max(1, size - 1))}
              disabled={size <= 1 || isLoadingMore}
              className="px-4 py-2 rounded-lg bg-white shadow-sm disabled:opacity-60"
            >
              Prev
            </button>

            <div className="px-4 py-2 rounded-lg bg-white shadow-sm text-sm">
              Page {Math.min(size, pageCount || 1)} of {pageCount || '...'}
            </div>

            <button
              onClick={() => setSize(size + 1)}
              disabled={isReachingEnd || isLoadingMore}
              className="px-4 py-2 rounded-lg bg-primary text-white font-semibold disabled:opacity-60"
            >
              {isLoadingMore ? 'Loading…' : isReachingEnd ? 'No more' : 'Next'}
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setSize(1)}
              disabled={size === 1 || isLoadingMore}
              className="px-4 py-2 rounded-lg bg-white shadow-sm disabled:opacity-60"
            >
              First
            </button>

            <button
              onClick={() => setSize( Math.ceil((totalCount || 0) / limit) )}
              disabled={isReachingEnd || isLoadingMore}
              className="px-4 py-2 rounded-lg bg-white shadow-sm disabled:opacity-60"
            >
              Last
            </button>

            <div className="text-sm text-neutral-600">
              {totalCount ? `${totalCount} products` : isLoadingInitial ? 'Loading…' : ''}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
