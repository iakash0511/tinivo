'use client'
import { Product } from '@/interface/ProductInterface'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Button } from '../ui/button'
import { useRouter } from 'next/navigation'
import { useCart } from '@/store/cart/cart-store'
import FeaturedCard from '../cart/FeaturedCard'

export default function HeroSection({ featuredProducts = [] }: { featuredProducts?: Product[] }) {
  const addToCart = useCart((state) => state.addItem) as (item: Product & { quantity: number; giftWrap: boolean }) => void;
  const router = useRouter();
  const product = featuredProducts[0];
  const handleAddToCart = (p: Product) => {
    addToCart({ ...p, _id: p._id, quantity: 1, giftWrap: p?.giftWrap, image: p.image });
  };

  const handleBuyNow = (e: React.MouseEvent<HTMLButtonElement>, p: Product) => {
    e.preventDefault();
    handleAddToCart(p);
    router.push("/checkout");
  };
  return (
    <section className="relative overflow-hidden bg-softPink px-4 py-12">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-center">
        {/* Left: Text */}
        <div className="space-y-6">
          <div className='flex justify-between items-center'>
          <h1 className="text-4xl lg:text-6xl font-heading leading-tight text-neutral-dark">
            <span className='text-xl lg:text-3xl lowercase italic text-shadow-lg'>Small</span> <span className='text-shadow-lg'>things.</span><br /> 
            <span className="text-primary font-semibold text-shadow-sm"><span className='text-5xl lg:text-8xl'>Big</span> joy.</span>
          </h1>
          <Link href="/our-story" className="text-md lg:text-xl px-4 py-2 rounded-lg bg-primary text-white">Why Tinivo?🤔</Link>
          {/* <Image src={'/assets/hero/hero-section.png'} alt={featuredProducts[0]?.name || 'Featured'} width={150} height={280} className="object-cover rounded-xl p-2" onClick={() => router.push(`/product/${featuredProducts?.[0]?.slug}`)}/> */}
          </div>
          <p className="text-base md:text-lg font-body text-neutral-600 max-w-xl">
            Tiny finds curated for daily delight — thoughtful gifts, cute moments, and little joys that feel like hugs.
          </p>

          <div className="flex gap-2 items-center">
            <span className='text-md font-medium text-wrap italic'>Loved by 2,000+ cute-find lovers 💕</span>
             <Link href="/shop" className="inline-flex items-center text-nowrap gap-3 p-3 rounded-2xl font-cta text-white bg-linear-to-r from-primary to-accent1 shadow-lg shadow-accent1 transform transition hover:-translate-y-0.5 active:translate-y-0.5">
              Discover mini joys✨
            </Link>
          </div>
        </div>

        {/* Right: Visual / Featured product mockup */}
        <div className="relative flex justify-center">
          <div className="w-[340px] h-[420px] rounded-3xl bg-white shadow-[0_20px_40px_rgba(157,126,219,0.12)] transform transition hover:scale-105 flex flex-col gap-1 items-center relative p-2">
            <Image src={featuredProducts[0]?.image || '/placeholders/panda.png'} alt={featuredProducts[0]?.name || 'Featured'} width={340} height={280} className="object-contain rounded-xl p-2" onClick={() => router.push(`/product/${featuredProducts?.[0]?.slug}`)} priority/>
            <p className='absolute top-4 left-4 bg-accent1 text-white p-1 rounded-md text-xs italic'>Featured</p>
             <p className="text-xl font-cta text-primary flex gap-2 items-center">
              <span className="text-gray-600 line-through">
                ₹{product.compareAtPrice}
              </span>
              ₹{product.price}
            </p>
            <Button
            onClick={(e) => handleBuyNow(e, product)}
            className="bg-primary text-white hover:opacity-90 w-full font-cta"
          >
            Buy Now 💜
          </Button>
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
            <FeaturedCard key={p._id} p={p} handleBuyNow={handleBuyNow}/>
          ))}
        </div>
      </div>
    </section>
  )
}
