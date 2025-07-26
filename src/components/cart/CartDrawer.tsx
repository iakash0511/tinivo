'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import CartItemCard from './CartItemCard';
import CartSummary from './CartSummary';
import { SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/store/cart/cart-store';

export function CartDrawer() {
  const items = useCart((state) => state.items);

  const isEmpty = items.length === 0;

  return (
    <div className="flex flex-col h-full bg-white shadow-lg">
      {/* Header */}
      <SheetHeader className="px-6 pt-4 shrink-0">
        <SheetTitle className="font-logo text-lg">Your Cart</SheetTitle>
      </SheetHeader>

      <Separator className="my-4 shrink-0" />

      {/* Cart Content */}
      <div className="flex-1 overflow-y-auto px-4">
        {isEmpty ? (
          <div className="flex items-center justify-center h-full text-neutral-500 text-sm">
            Your cart is empty 😔
          </div>
        ) : (
          <ScrollArea className="h-full pr-2">
            <div className="flex flex-col gap-4 ">
              {items.map((item) => (
                <CartItemCard key={item.id} {...item} />
              ))}
            </div>
          </ScrollArea>
        )}
      </div>

      {/* Summary */}
      {!isEmpty && (
        <div className="sticky bottom-0 z-10 bg-white border-t border-neutral-200 p-4">
          <CartSummary />
        </div>
      )}
    </div>
  );
}
