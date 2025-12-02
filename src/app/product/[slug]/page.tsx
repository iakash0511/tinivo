'use client'
import useSWR from 'swr'
import ProductGallery from '@/components/product/ProductGallery'
import ProductInfo from '@/components/product/ProductInfo'
import ProductTabs from '@/components/product/ProductTabs'
import { useParams } from 'next/navigation'

const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function ProductPageClient() {
  const params = useParams()
  const slug = params.slug as string
  const { data: product, error, isLoading } = useSWR(`/api/product/${slug}`, fetcher, {
    dedupingInterval: 60000, // same client won't refetch within 60s
    revalidateOnFocus: false
  })

  if (isLoading) return <div className='flex justify-between items-center'>Loading your mini joy... 💜</div>
  if (error || !product) return <div className='flex justify-between items-center'>Oops! We couldn’t find that product 😔</div>

  return (
    <main className="min-h-screen px-4 py-12">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10">
        <ProductGallery images={product.images} />
        <div className="flex flex-col gap-8">
          <ProductInfo product={product} />
          <ProductTabs description={product.description} shipping={product.shipping} care={product.care} />
        </div>
      </div>
    </main>
  )
}
