// app/product/[slug]/page.tsx
import React from "react"
import ProductGallery from "@/components/product/ProductGallery"
import ProductInfo from "@/components/product/ProductInfo"
import ProductTabs from "@/components/product/ProductTabs"
import { notFound } from "next/navigation"
import { getSanityClient } from "@/lib/getSanityClient"

export const revalidate = 60 // Next will revalidate this page every 60s (ISR)

async function fetchProductBySlug(slug: string) {
  const client = await getSanityClient()
  const query = `*[_type == "product" && slug.current == $slug][0]{
    _id,
    name,
    price,
    compareAtPrice,
    quantity,
    description,
    shipping,
    care,
    "images": images[].asset->url,
    "slug": slug.current
  }`
  const product = await client.fetch(query, { slug })
  return product
}

export default async function ProductPage({ params }: { params?: Promise<{ slug: string }> }) {
  const resolvedParams = params ? await params : undefined
  const slug = resolvedParams?.slug

  if (!slug) {
    notFound()
  }
  const product = await fetchProductBySlug(slug)

  if (!product) {
    notFound()
  }

  return (
    <main className="min-h-screen px-4 py-12">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10">
        <ProductGallery images={product.images || []} />
        <div className="flex flex-col gap-8">
          <ProductInfo product={product} />
          <ProductTabs description={product.description} shipping={product.shipping} care={product.care} />
        </div>
      </div>
    </main>
  )
}
