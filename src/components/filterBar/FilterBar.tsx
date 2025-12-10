'use client'
import React, { useEffect, useId, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import clsx from 'clsx'
import { Ban, FilterIcon,  } from 'lucide-react'

type Category = { label: string; value: string }
type Sort = { label: string; value: string }

export default function FilterBar({
  initialSearch = '',
  initialCategory = '',
  initialSort = 'newest',
  initialMin,
  initialMax,
  initialBestseller = false,
  initialInStock = false,
  perPage = 24,
  categories = [],
  sorts = []
}: {
  initialSearch?: string
  initialCategory?: string
  initialSort?: string
  initialMin?: number | undefined
  initialMax?: number | undefined
  initialBestseller?: boolean
  initialInStock?: boolean
  perPage?: number
  categories?: Category[]
  sorts?: Sort[]
}) {
  const router = useRouter()
  const searchParams = useSearchParams() // readonly snapshot of current params
  const isFiltered = Array.from(searchParams?.keys() || []).length > 0

  // form state
  const [search, setSearch] = useState(initialSearch || '')
  const [category, setCategory] = useState(initialCategory || '')
  const [sort, setSort] = useState(initialSort || 'newest')
  const [min, setMin] = useState<string>(initialMin !== undefined ? String(initialMin) : '')
  const [max, setMax] = useState<string>(initialMax !== undefined ? String(initialMax) : '')
  const [bestseller, setBestseller] = useState(initialBestseller)
  const [inStock, setInStock] = useState(initialInStock)
  const [open, setOpen] = useState(false) // mobile drawer open

  // Keep local state in sync if URL changes externally (e.g., back button)
  useEffect(() => {
    setSearch(initialSearch || '')
    setCategory(initialCategory || '')
    setSort(initialSort || 'newest')
    setMin(initialMin !== undefined ? String(initialMin) : '')
    setMax(initialMax !== undefined ? String(initialMax) : '')
    setBestseller(Boolean(initialBestseller))
    setInStock(Boolean(initialInStock))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams?.toString()]) // update if url changes

  // Build URLSearchParams from current state
  function buildQueryParams(override: Record<string, string | number | boolean | undefined> = {}) {
    const qp = new URLSearchParams()
    const final = {
      search: search?.trim(),
      category: category || undefined,
      sort: sort || undefined,
      min: min ? String(min) : undefined,
      max: max ? String(max) : undefined,
      bestseller: bestseller ? '1' : undefined,
      inStock: inStock ? '1' : undefined,
      perPage: perPage ? String(perPage) : undefined,
      ...override   
    } as Record<string, string | undefined>

    Object.keys(final).forEach((k) => {
      const v = final[k as keyof typeof final]
      if (v === undefined || v === null || v === '') return
      qp.set(k, String(v))
    })
    return qp.toString() ? `?${qp.toString()}` : ''
  }

  // Push using router.push to keep client nav (no full refresh)
  function applyFilters(replacePage = 1) {
    const q = buildQueryParams({ page: replacePage })
    router.push(`/shop${q}`)
    setOpen(false)
  }

  function clearFilters() {
    router.push(`/shop`)
    setOpen(false)
  }

  // Form submit
  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    applyFilters(1)
  }

  const searchId = useId()
  const minId = useId()
  const maxId = useId()

  return (
    <div className="mb-6">     
      <h1 className="text-3xl font-heading mb-6 text-center">
        {isFiltered ? `Filtered Products` : `All Products ✨`}
      </h1>
      {/* Top row: search + actions */}
      <div className="flex gap-3 items-center">
        <form onSubmit={onSubmit} className="flex-1 flex gap-3">
          <label htmlFor={searchId} className="sr-only">Search products</label>
          <input
            id={searchId}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products, e.g., 'panda mirror'"
            className="w-full px-4 py-2 rounded-lg border border-primary shadow-sm bg-white"
            aria-label="Search products"
          />
          <button type="submit" className="px-4 py-2 rounded-lg bg-primary text-white font-cta">Search</button>
        </form>

        {/* Mobile: open filters button */}
        <button
          onClick={() => setOpen(true)}
          className={`lg:hidden px-3 py-2 rounded-lg border ${isFiltered ? 'bg-primary text-white' : 'bg-white text-primary'}`}
          aria-label="Open filters"
        >
          <FilterIcon size={20} />
        </button>

        {/* Desktop quick button to clear */}
        <button
          onClick={clearFilters}
          disabled={!isFiltered}
          className="inline-flex lg:hidden items-center gap-2 px-3 py-2 rounded-lg bg-white border text-sm text-primary"
        >
          <Ban size={20} />
        </button>
      </div>

      {/* Desktop filters inline */}
      <div className="hidden lg:flex gap-3 items-center mt-3 rounded-2xl p-3 ">
        {/* Category */}
        <div className="flex items-center gap-2">
          <label className="text-sm text-neutral-600 mr-2">Category</label>
          <select
            value={category ?? ''}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3 py-2 rounded-lg border bg-white"
            aria-label="Filter by category"
          >
            {categories.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <label className="text-sm text-neutral-600 mr-2">Sort</label>
          <select value={sort ?? 'newest'} onChange={(e) => setSort(e.target.value)} className="px-3 py-2 rounded-lg border bg-white" aria-label="Sort products">
            {sorts.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <label htmlFor={minId} className="sr-only">Minimum price</label>
          <input id={minId} value={min} onChange={(e) => setMin(e.target.value)} placeholder="Min ₹" type="number" min={0} className="px-3 py-2 rounded-lg border w-24" />
          <label htmlFor={maxId} className="sr-only">Maximum price</label>
          <input id={maxId} value={max} onChange={(e) => setMax(e.target.value)} placeholder="Max ₹" type="number" min={0} className="px-3 py-2 rounded-lg border w-24" />
        </div>

        {/* Toggles */}
        <label className="inline-flex items-center gap-2 text-sm">
          <input type="checkbox" checked={bestseller} onChange={() => setBestseller(!bestseller)} />
          <span>Bestsellers</span>
        </label>

        <label className="inline-flex items-center gap-2 text-sm">
          <input type="checkbox" checked={inStock} onChange={() => setInStock(!inStock)} />
          <span>In stock</span>
        </label>

        {/* Apply / Clear */}
        <div className="ml-auto flex items-center gap-2">
          <button onClick={() => applyFilters(1)} className="px-4 py-2 rounded-lg bg-primary text-white">Apply</button>
          <button onClick={clearFilters} className="px-3 py-2 rounded-lg bg-white border">Clear</button>
        </div>
      </div>

      {/* Mobile drawer / overlay */}
      <div
        className={clsx("fixed inset-0 z-50 lg:hidden transition-opacity", open ? "pointer-events-auto" : "pointer-events-none")}
        aria-hidden={!open}
      >
        {/* backdrop */}
        <div
          onClick={() => setOpen(false)}
          className={clsx("absolute inset-0 bg-black/40 transition-opacity", open ? "opacity-100" : "opacity-0")}
          aria-hidden="true"
        />

        {/* drawer panel */}
        <aside
          role="dialog"
          aria-modal="true"
          aria-label="Filters"
          className={clsx("absolute left-0 top-0 h-full w-11/12 max-w-xs bg-white p-4 shadow-lg transform transition-transform", open ? "translate-x-0" : "-translate-x-full")}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Filters</h3>
            <button onClick={() => setOpen(false)} aria-label="Close filters" className="px-2 py-1 rounded">✕</button>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-sm mb-1">Category</label>
              <select value={category ?? ''} onChange={(e) => setCategory(e.target.value)} className="w-full px-3 py-2 rounded-lg border">
                {categories.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm mb-1">Sort</label>
              <select value={sort ?? 'newest'} onChange={(e) => setSort(e.target.value)} className="w-full px-3 py-2 rounded-lg border">
                {sorts.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <input value={min} onChange={(e) => setMin(e.target.value)} placeholder="Min ₹" type="number" min={0} className="px-3 py-2 rounded-lg border" />
              <input value={max} onChange={(e) => setMax(e.target.value)} placeholder="Max ₹" type="number" min={0} className="px-3 py-2 rounded-lg border" />
            </div>

            <div className="flex flex-col gap-2">
              <label className="inline-flex items-center gap-2">
                <input type="checkbox" checked={bestseller} onChange={() => setBestseller(!bestseller)} />
                <span>Bestsellers</span>
              </label>

              <label className="inline-flex items-center gap-2">
                <input type="checkbox" checked={inStock} onChange={() => setInStock(!inStock)} />
                <span>In stock</span>
              </label>
            </div>

            <div className="flex gap-2 mt-3">
              <button onClick={() => applyFilters(1)} className="flex-1 px-4 py-2 rounded-lg bg-primary text-white">Apply</button>
              <button onClick={() => { clearFilters(); setOpen(false) }} className="flex-1 px-4 py-2 rounded-lg bg-white border">Clear</button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
