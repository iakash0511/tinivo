"use client";

import { Button } from "@/components/ui/button";
import { useCart } from "@/store/cart/cart-store";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGift, faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { Product } from "@/interface/ProductInterface";

export default function ProductInfo({ product }: { product: Product }) {
  const addToCart = useCart((state) => state.addItem) as (item: Product & { quantity: number; giftWrap: boolean }) => void;
  const router = useRouter();
  const [giftWrap, setGiftWrap] = useState(false);

  const isAvailable = Boolean(product.quantity && product.quantity > 0);

  const handleAddToCart = () => {
    addToCart({ ...product, _id: product._id, quantity: 1, giftWrap, image: product.images?.[0] });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push("/checkout");
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm flex flex-col gap-4">
      <h1 className="text-2xl font-heading">{product.name}</h1>
      <p className="text-xl font-cta text-primary flex gap-2 items-center">
        <span className="text-gray-600 line-through">
          ₹{product.compareAtPrice}
        </span>
        ₹{product.price}
        {!isAvailable && (
          <span className="inline-block bg-neutral-dark text-white text-xs font-semibold px-3 py-1 rounded-full">
            SOLD OUT
          </span>
        )}
      </p>
      <div className="flex flex-col gap-3">
        <p className="text-neutral-600 font-body line-clamp-2">
          Shipping will be calculated at checkout.
        </p>
        <p className="text-sm text-neutral-600 text-left">
          ✨Free Shipping over ₹999
        </p>
      </div>
      {/* {isAvailable && (
        <div className="flex items-center gap-2 ">
          <input
            type="checkbox"
            id="gift"
            checked={giftWrap}
            onChange={() => setGiftWrap(!giftWrap)}
            className="accent-primary"
          />
          <label
            htmlFor="gift"
            className="text-sm text-neutral-700 flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faGift} /> Add Gift Wrap (+₹49)
          </label>
        </div>
      )} */}

      {isAvailable && (
        <div className="flex gap-4">
          <Button
            onClick={handleAddToCart}
            className="bg-accent1 hover:opacity-90 flex-1 font-cta text-white"
          >
            <FontAwesomeIcon icon={faCartShopping} className="mr-2 text-neutral-100/80" /> Add to
            Bag
          </Button>

          <Button
            onClick={handleBuyNow}
            className="bg-primary text-white hover:opacity-90 flex-1 font-cta"
          >
            Buy Now 💜
          </Button>
        </div>
      )}
    </div>
  );
}
