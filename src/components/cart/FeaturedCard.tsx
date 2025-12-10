import Image from 'next/image';
import Link from 'next/link'
import React from 'react'
import { Button } from '../ui/button';
import { Product } from '@/interface/ProductInterface';

function FeaturedCard({p, handleBuyNow}: {p: Product, handleBuyNow: () => void}) {
  return (
    <Link prefetch={false} key={p._id} href={`/product/${p.slug}`} className="max-w-50 min-w-40 bg-white rounded-xl p-3 shadow-sm transform transition hover:scale-105">
        <div className="w-full aspect-square rounded-lg overflow-hidden mb-2 bg-neutral-50 relative">
        <Image src={p.image} alt={p.name} width={200} height={200} className="object-cover" priority/>
         <p className={`absolute top-0 left-0 ${p.quantity > 0 ? 'bg-accent1':'bg-neutral-400'} text-white p-1 rounded-md text-[0.7rem] italic`}>{p.quantity > 0 ? p.tags : 'Sold Out'}</p>
        </div>
        <div className="text-sm font-heading line-clamp-1 text-center">{p.name}</div>
        <div className="text-primary font-cta font-semibold mt-1 text-center"> 
            <span className="text-gray-600 line-through mr-1">
                ₹{p.compareAtPrice}
            </span>₹{p.price}
        </div>
         <Button
            onClick={handleBuyNow}
            className="bg-primary text-white hover:opacity-90 w-full font-cta"
          >
            Buy Now
          </Button>
    </Link>
  )
}

export default FeaturedCard