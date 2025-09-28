import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { BestSellerItem } from "@/interface/BestSellerInterface";
import AddToCartButton from "../cart/AddToCartButton";

export default function BestsellerCard({ item, id }: { item: BestSellerItem; id: string }) {
  const slug = `/product/${item?.id}`;

  return (
    <motion.div
      key={id}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white rounded-2xl shadow-md p-4 flex flex-col items-center text-center transition-all"
    >
      {/* 👉 Clickable Image */}
      <Link href={slug} className="block w-full">
        <Image
          src={item.image}
          alt={item.name}
          width={200}
          height={200}
          className="rounded-xl object-cover mb-4 cursor-pointer transition-transform duration-300 hover:scale-105"
        />
      </Link>

      {/* 👉 Clickable Name & Tag */}
      <Link href={slug}>
        {item.tag && (
          <div className="text-xs text-accent1 font-semibold mb-1">
            {item.tag}
          </div>
        )}
        <h3 className="font-heading text-base text-neutral-dark mb-1 hover:underline">
          {item.name}
        </h3>
      </Link>

      <p className="text-sm text-neutral-dark/70 mb-2">{item.description}</p>

      <p className="font-cta text-primary text-lg mb-3">₹{item.price}</p>
        <AddToCartButton item={item} />
    </motion.div>
  );
}