'use client'
// app/product/[slug]/page.tsx
import React, { useState } from 'react'
import { getProductBySlug } from '@/lib/mock-products'
import { useParams } from "next/navigation";
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import AddToCartButton from '@/components/cart/AddToCartButton'
import Testimonials from '@/components/sections/Testimonals'


export default function ProductPage() {
  const params = useParams<{ slug: string }>();

  const [qty, setQty] = useState(1);
  
  const {slug } = params

  const product = getProductBySlug(slug)
  
  if (!product) return notFound()

  return (
    <div className="container mx-auto px-4 py-10">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
      {/* Image */}
      <div className="w-full">
        <Image
          src={product.image}
          alt={product.name}
          width={500}
          height={500}
          className="rounded-xl w-full h-auto object-cover max-w-full"
          priority={false}
        />
      </div>

      {/* Info */}
      <div className="space-y-4">
        <h1 className="text-3xl font-heading text-neutral-dark">{product.name}</h1>
        <p className="mt-2 text-sm text-neutral-dark/70">{product.description}</p>

        <p className="text-xl font-cta text-primary mt-4">₹{product.price}</p>

        {/* Optional gift wrap toggle */}
        {product.isGiftable && (
          <div className="mt-4 flex items-center gap-2 text-sm">
            <input type="checkbox" id="gift" className="accent-primary" />
            <label htmlFor="gift" className="text-neutral-dark">
              Add gift wrap 🎁 (+₹20)
            </label>
          </div>
        )}

        {/* Quantity Selector */}
        <div className="flex items-center space-x-2 mt-4">
          <label className="text-sm font-medium text-neutral-dark">Qty:</label>
          <div className="flex items-center border rounded-lg">
            <button className="px-3 py-1" disabled={qty === 1} onClick={() => setQty(pre => pre - 1)}>-</button>
            <span className="px-4">{qty}</span>
            <button className="px-3 py-1" onClick={() => setQty(pre => pre + 1)}>+</button>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
         <AddToCartButton item={product} quantity={qty}/>
          <Button className="bg-accent1 hover:bg-primary text-neutral-dark font-bold cursor-pointer rounded-full">
            Buy Now
          </Button>
        </div>

        {/* Extra Tabs (Care / Shipping) */}
        <div className="mt-10 space-y-4 text-sm text-neutral-dark/80">
          <div>
            <h4 className="font-semibold">Care</h4>
            <p>{product.care}</p>
          </div>
          <div>
            <h4 className="font-semibold">Shipping</h4>
            <p>{product.shipping}</p>
          </div>
        </div>
      </div>
      </div>
       {/* Testimonal */}
        <Testimonials />
    </div>
  )
}
