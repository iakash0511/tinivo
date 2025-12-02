'use client';
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { BestSellerItem } from "@/interface/BestSellerInterface";
import AddToCartButton from "../cart/AddToCartButton";

export default function BestsellerCard({ item, id }: { item: BestSellerItem; id: string }) {

  const slug = `/product/${item.slug}`;
  const isAvailable = Boolean(item.quantity && item.quantity > 0);

  // conditional classes for blur + desaturate + reduced pointer events
  const contentEffect = isAvailable ? '' : 'opacity-90';
  const actionDisable = isAvailable ? '' : 'pointer-events-none';

  return (
    <motion.div
      key={id}
      whileHover={isAvailable ? { scale: 1.03 } : undefined}
      whileTap={isAvailable ? { scale: 0.98 } : undefined}
      className="bg-white rounded-2xl shadow-md p-4 flex flex-col items-center text-center transition-all relative"
    >
      {/* Sold Out badge (top-left) */}
      {!isAvailable && (
        <div className="absolute left-3 top-3 z-20">
          <span className="inline-block bg-neutral-dark text-white text-xs font-semibold px-3 py-1 rounded-full">
            SOLD OUT
          </span>
        </div>
      )}

      {/* 👉 Clickable Image */}
      <Link href={slug} className={`flex justify-center w-full`}>
        <Image
          src={item.image}
          alt={item.name}
          width={200}
          height={200}
          className="rounded-xl object-cover mb-4 cursor-pointer transition-transform duration-300 hover:scale-105"
        />
      </Link>

      {/* 👉 Clickable Name & Tag */}
      <Link href={slug} className={`${contentEffect} w-full`}>
        {item.tag && (
          <div className="text-xs text-accent1 font-semibold mb-1">
            {item.tag}
          </div>
        )}
        <h3 className="font-heading text-base text-neutral-dark mb-1 hover:underline">
          {item.name}
        </h3>
      </Link>

      <p className={`text-sm text-neutral-dark/70 mb-2 line-clamp-2 text-ellipsis ${contentEffect}`}>
        {item.description}
      </p>

      <p className={`font-cta font-semibold text-primary text-lg mb-3 flex gap-2 ${contentEffect}`}>
        <span className="text-gray-600 line-through">₹{item.compareAtPrice}</span>₹{item.price}
      </p>

      {/* AddToCart area — disabled visually & functionally when sold out */}
      {isAvailable &&(
        <div
          className={`w-full ${actionDisable} ${!isAvailable ? 'opacity-70' : ''}`}
          aria-disabled={!isAvailable}
          role={!isAvailable ? 'status' : undefined}
        >
          <AddToCartButton item={item} isDisabled={!isAvailable} />
        </div>
      )}
    </motion.div>
  );
}
