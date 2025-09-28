'use client';
import React from 'react';
import { BestSellerItem } from '@/interface/BestSellerInterface';
import { useCart } from '@/store/cart/cart-store';
import { useState } from "react";
import toast from "react-hot-toast";

export default function AddToCartButton({ item, quantity }: { item: BestSellerItem, quantity?: number }) {
  const [isAdded, setIsAdded] = useState(false);
  const addItem = useCart((state) => state.addItem);
  const updateQuantity = useCart((state) => state.updateItemQuantity);
  const cartItem = useCart((state) => state.items.find((i) => i.id === item.id));
  const currentQuantity = cartItem ? cartItem.quantity : 0;
    const handleAddItem = () => {
    if (!item) return;
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
    // Add item to cart
    if (currentQuantity > 0) {
      toast.success(`Increased quantity of ${item.name} in cart!`);
      updateQuantity(item.id, currentQuantity + (quantity ? quantity : 1));
      return;
    }
    addItem({   
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: quantity ? quantity : 1,
        giftWrap: false,
    });
    toast.success(`${item.name} added to cart!`, {position: "bottom-right"});
  }
  return (
    <button
      className="bg-primary text-white px-4 py-2 rounded-full font-cta text-sm hover:bg-accent1 transition"
      onClick={handleAddItem}
        aria-label={`Add ${item.name} to cart`}
    >
      {isAdded ? "✅ Added!" : "Add to Bag"}
    </button>
  );
}