import Image from "next/image";
import { motion } from "framer-motion";
import { useCart } from "@/store/cart/cart-store";
import toast from "react-hot-toast";
import { useState } from "react";
import { BestSellerItem } from "@/interface/BestSellerInterface";

export default function BestsellerCard({ item, id}: { item: BestSellerItem, id: string }) {
  const [isAdded, setIsAdded] = useState(false);
  const addItem = useCart((state) => state.addItem);

  const handleAddItem = (item: BestSellerItem) => {
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
    // Add item to cart
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      giftWrap: false,
    });
    toast.success(`${item.name} added to cart!`);
  };

  return (
    <motion.div
              key={item.id}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white rounded-2xl shadow-md p-4 flex flex-col items-center text-center transition-all"
            >
              <Image
                src={item.image}
                alt={item.name}
                width={200}
                height={200}
                className="rounded-xl object-cover mb-4"
              />

              <div className="text-xs text-accent1 font-semibold mb-1">
                {item.tag}
              </div>

              <h3 className="font-heading text-base text-neutral-dark mb-1">
                {item.name}
              </h3>

              <p className="text-sm text-neutral-dark/70 mb-2">
                {item.description}
              </p>

              <p className="font-cta text-primary text-lg mb-3">
                ₹{item.price}
              </p>

              <button
                className="bg-primary text-white px-4 py-2 rounded-full font-cta text-sm hover:bg-accent1 transition"
                onClick={() => handleAddItem(item)}
              >
                {isAdded ? '✅ Added!' : 'Add to Bag'}
              </button>
            </motion.div>
  );
}