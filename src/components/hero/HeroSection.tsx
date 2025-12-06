'use client'
import { Product } from '@/interface/ProductInterface'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

// Example: props.featuredProducts = [{ _id, name, price, image, slug }]
export default function HeroSection({ featuredProducts = [] }: { featuredProducts?: Product[] }) {
  return (
    <section className="relative overflow-hidden bg-softPink px-4 py-12">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-center">
        {/* Left: Text */}
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl font-heading leading-tight text-neutral-dark">
            <span className='text-xl lowercase'>Small</span> things.<br /> <span className="text-primary font-semibold"><span className='text-5xl'>Big</span> joy.</span>
          </h1>

          <p className="text-base md:text-lg font-body text-neutral-600 max-w-xl">
            Tiny finds curated for daily delight — thoughtful gifts, cute moments, and little joys that feel like hugs.
          </p>

          <div className="flex gap-4 items-center">
            <Link href="/shop" className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl font-cta text-white bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent1)] shadow-lg transform transition hover:-translate-y-0.5 active:translate-y-0.5">
              Bring home joy ✨
            </Link>

            <Link href="/gifting" className="text-sm px-4 py-2 rounded-lg bg-white shadow-sm text-neutral-700">Gift ideas 🎁</Link>
          </div>

          {/* small trust row */}
          <div className="flex items-center gap-3 text-sm text-neutral-500">
            <span>Free shipping over ₹999</span>
            <span className="inline-block w-px h-4 bg-neutral-200" />
            <span>Easy 7-day returns</span>
          </div>
        </div>

        {/* Right: Visual / Featured product mockup */}
        <div className="relative flex justify-center">
          <div className="w-[340px] h-[340px] rounded-3xl bg-white shadow-[0_20px_40px_rgba(157,126,219,0.12)] p-6 transform transition hover:scale-105">
            <Image src={featuredProducts[0]?.image || '/placeholders/panda.png'} alt={featuredProducts[0]?.name || 'Featured'} width={280} height={280} className="object-contain" />
          </div>

          {/* soft decorative glow */}
          <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full blur-3xl" style={{ background: 'linear-gradient(90deg, rgba(157,126,219,0.18), rgba(255,183,213,0.12))' }} />
        </div>
      </div>

      {/* Featured products strip */}
      <div className="max-w-6xl mx-auto mt-10">
        <h4 className="text-sm text-neutral-500 mb-3">Featured picks</h4>
        <div className="flex gap-4 overflow-x-auto pb-3">
          {featuredProducts.slice(0,4).map(p => (
            <Link key={p._id} href={`/product/${p.slug}`} className="min-w-[160px] bg-white rounded-xl p-3 shadow-sm transform transition hover:scale-105">
              <div className="w-full aspect-square rounded-lg overflow-hidden mb-2 bg-neutral-50">
                <Image src={p.image} alt={p.name} width={200} height={200} className="object-cover" />
              </div>
              <div className="text-sm font-heading line-clamp-1">{p.name}</div>
              <div className="text-primary font-cta font-semibold mt-1">₹{p.price}</div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
