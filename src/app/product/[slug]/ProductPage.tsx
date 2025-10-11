"use client"

import ProductGallery from "@/components/product/ProductGallery"
import ProductInfo from "@/components/product/ProductInfo"
import ProductTabs from "@/components/product/ProductTabs"
import { useEffect, useState } from "react"
import { client } from "@/lib/sanity.client"
import { productBySlugQuery } from "@/lib/queries"
import { useParams } from "next/navigation"
import { Product } from "@/interface/ProductInterface"

export default function ProductPage() {
  const params = useParams()
  const slug = params.slug as string
  const [product, setProduct] = useState<Product>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await client.fetch(productBySlugQuery, { slug })
        if (!response) {
          setError(true)
        } else {
          setProduct(response)
        }
      } catch (err) {
        console.error("Sanity fetch error:", err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    if (slug) fetchProduct()
  }, [slug])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-neutral-600 font-heading">
        Loading your mini joy... 💜
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-neutral-600 font-heading">
        <p>Oops! We couldn’t find that product 😔</p>
        <p className="text-sm mt-2">Please check back later or explore our bestsellers.</p>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-light-bg px-4 py-12">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10">
        <ProductGallery images={product.images} />
        <div className="flex flex-col gap-8">
          <ProductInfo product={product} />
          <ProductTabs
            description={product.description}
            shipping={product.shipping}
            care={product.care}
          />
        </div>
      </div>
    </main>
  )
}
