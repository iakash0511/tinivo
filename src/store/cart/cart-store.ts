// stores/useCart.ts
import { pushAddToCart } from "@/lib/analyticsPush";
import { create } from "zustand";

export type CartItem = {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  quantityLeft?: number;
  giftWrap?: boolean;
  image?: string; 
  compareAtPrice?: number;
  category?: string;
  tags?: string;
};

type CartStore = {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateItem: (id: string, updates: Partial<CartItem>) => void
  updateItemQuantity: (id: string, quantity: number) => void
  toggleGiftWrap: (id: string) => void
  clearCart: () => void
  removeFromCart: (id: string) => void
  totalItems: () => number;
};

export const useCart = create<CartStore>((set, get) => ({
  items: [],
  addItem: (item) =>
    set((state) => {
      const exists = state.items.find((i) => i._id === item._id);
      pushAddToCart(item, 1); // Push to dataLayer for analytics
      if (exists) {
        return {
          ...state,
          items: state.items.map((i) =>
            i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      } else {
        return { ...state, items: [...state.items, item] };
      }
    }),
  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((i) => i._id !== id),
    })),
  updateItem: (id, updates) =>
    set((state) => ({
      items: state.items.map((item) =>
        item._id === id ? { ...item, ...updates } : item
      ),
    })),
  clearCart: () => set({ items: [] }),
  updateItemQuantity: (id: string, quantity: number) =>
    set((state) => ({
      items: state.items.map((item) =>
        item._id === id ? { ...item, quantity } : item
      ),
    })),
  removeFromCart: (id: string) =>
    set((state) => ({
      items: state.items.filter((item) => item._id !== id),
    })),
  toggleGiftWrap: (id: string) =>
    set((state) => ({
      items: state.items.map((item) =>
        item._id === id ? { ...item, giftWrap: !item.giftWrap } : item
      ),
    })),
    totalItems: () => get().items.reduce((total, item) => total + item.quantity, 0)
}));
