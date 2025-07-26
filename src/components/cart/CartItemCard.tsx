'use client';

import Image from 'next/image';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '@/store/cart/cart-store';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

type CartItemCardProps = {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  giftWrap?: boolean;
};

export default function CartItemCard({
  id,
  name,
  price,
  image,
  quantity,
  giftWrap = false,
}: CartItemCardProps) {
  const {
    updateItemQuantity,
    removeFromCart,
    toggleGiftWrap,
  } = useCart();

  return (
    <div className="flex gap-4 rounded-2xl bg-white p-4 shadow-sm border border-neutral-200">
      <div className="relative w-20 h-20 shrink-0 rounded-xl overflow-hidden border">
        <Image
          src={image || ''}
          alt={name}
          fill
          className="object-cover"
        />
      </div>

      <div className="flex flex-col justify-between flex-1">
        {/* Name + Remove */}
        <div className="flex justify-between items-start">
          <p className="font-heading text-sm text-neutral-dark">{name}</p>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted hover:text-red-500"
            onClick={() => removeFromCart(id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center gap-2 mt-2">
          <Button
            size="icon"
            variant="outline"
            onClick={() => updateItemQuantity(id, quantity - 1)}
            disabled={quantity <= 1}
            className="w-6 h-6"
          >
            <Minus className="w-3 h-3" />
          </Button>
          <span className="text-sm w-6 text-center">{quantity}</span>
          <Button
            size="icon"
            variant="outline"
            onClick={() => updateItemQuantity(id, quantity + 1)}
            className="w-6 h-6"
          >
            <Plus className="w-3 h-3" />
          </Button>
        </div>

        {/* Gift Wrap Toggle + Price */}
        <div className="flex justify-between items-center mt-3">
          <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
            <Checkbox
              checked={giftWrap}
              onCheckedChange={() => toggleGiftWrap(id)}
            />
            Gift wrap (+₹49)
          </label>

          <span className="font-medium text-sm text-neutral-dark">
            ₹{(price * quantity + (giftWrap ? 49 : 0)).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
