// components/ui/ProductCard.tsx

"use client";
import { motion } from "framer-motion";
import Image from "next/image";

type ProductCardProps = {
  title: string;
  price: string;
  image: string;
  tag?: string;
};

export function ProductCard({ title, price, image, tag }: ProductCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="bg-white rounded-2xl shadow-md overflow-hidden transition-all border border-neutral-light"
    >
      <div className="relative">
        <Image src={image} alt={title} className="w-full h-56 object-cover" />
        {tag && (
          <span className="absolute top-2 left-2 bg-accent1 text-white text-xs font-bold px-2 py-1 rounded-full">
            {tag}
          </span>
        )}
      </div>
      <div className="p-4 space-y-1">
        <h3 className="font-heading text-sm text-neutral-dark">{title}</h3>
        <p className="font-cta text-base text-primary">{price}</p>
      </div>
    </motion.div>
  );
}
