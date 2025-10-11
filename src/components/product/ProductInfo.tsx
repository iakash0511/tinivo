"use client"

import { Button } from "@/components/ui/button"
import { useCart } from "@/store/cart/cart-store"
import { useRouter } from "next/navigation"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faGift, faCartShopping } from "@fortawesome/free-solid-svg-icons"
import { useState } from "react"
import { Product } from "@/interface/ProductInterface"

export default function ProductInfo({ product }: { product: Product }) {
  const addToCart = useCart((state) => state.addItem)
  const router = useRouter()
  const [giftWrap, setGiftWrap] = useState(false)

  const handleAddToCart = () => {
    addToCart({ ...product, _id: product._id, quantity: 1, giftWrap })
  }

  const handleBuyNow = () => {
    handleAddToCart()
    router.push("/checkout")
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm">
      <h1 className="text-2xl font-heading mb-2">{product.name}</h1>
      <p className="text-xl font-cta text-primary mb-4">
        ₹{product.price}
      </p>

      <p className="text-neutral-600 font-body mb-6">{product.description}</p>

      <div className="flex items-center gap-2 mb-6">
        <input
          type="checkbox"
          id="gift"
          checked={giftWrap}
          onChange={() => setGiftWrap(!giftWrap)}
          className="accent-primary"
        />
        <label htmlFor="gift" className="text-sm text-neutral-700 flex items-center gap-2">
          <FontAwesomeIcon icon={faGift} /> Add Gift Wrap (+₹49)
        </label>
      </div>

      <div className="flex gap-4">
        <Button
          onClick={handleAddToCart}
          className="bg-accent1 hover:opacity-90 flex-1 font-cta"
        >
          <FontAwesomeIcon icon={faCartShopping} className="mr-2" /> Add to Cart
        </Button>

        <Button
          onClick={handleBuyNow}
          className="bg-primary text-white hover:opacity-90 flex-1 font-cta"
        >
          Buy Now 💜
        </Button>
      </div>
      <p className="text-sm text-neutral-600 mt-2 text-center">✨ 3–5 Days Delivery | Free Shipping over ₹299</p>
    </div>
  )
}
