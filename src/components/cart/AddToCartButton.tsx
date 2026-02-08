'use client';
import React from 'react';
import { BestSellerItem } from '@/interface/BestSellerInterface';
import { useCart } from '@/store/cart/cart-store';
import { useState } from "react";
import toast from "react-hot-toast";

export default function AddToCartButton({ item, quantity, isDisabled }: { item: BestSellerItem, quantity?: number, isDisabled?: boolean }) {
  const [isAdded, setIsAdded] = useState(false);
  const addItem = useCart((state) => state.addItem);
  const updateQuantity = useCart((state) => state.updateItemQuantity);
  const cartItem = useCart((state) => state.items.find((i) => i._id === item._id));
  const currentQuantity = cartItem ? cartItem.quantity : 0;
    const handleAddItem = () => {
    if (!item) return;
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
    // Add item to cart
    if (currentQuantity > 0) {
      toast.success(`Increased quantity of ${item.name} in cart!`);
      updateQuantity(item._id, currentQuantity + (quantity ? quantity : 1));
      return;
    }
    addItem({
      _id: item._id,
      name: item.name,
      price: item.price,
      quantity: quantity ? quantity : 1,
      image: item.image,
      giftWrap: false,
      compareAtPrice: item.compareAtPrice,
      weight: item.weight,
      length: item.length,
      breadth: item.breadth,
      height: item.height
    });
    toast.success(`${item.name} added to cart!`, {position: "bottom-right"});
  }
  return (
    <button
      className="bg-primary text-white px-4 py-2 rounded-full font-cta text-sm hover:bg-accent1 transition"
      onClick={handleAddItem}
        aria-label={`Add ${item.name} to cart`}
        disabled={isDisabled}
    >
      {isAdded ? "✅ Added!" : "Add to Bag"}
    </button>
  );
}