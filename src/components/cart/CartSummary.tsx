'use client';

import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { useCheckoutCTA } from '@/hooks/useCheckoutCta';
import { useCartTotal } from '@/hooks/useCartTotal';
import { useRouter } from 'next/navigation';
import { SheetClose } from '../ui/sheet';

export default function CartSummary() {
  const { subtotal, giftWrapTotal, total, shipping, compareTotal, finalPayable } = useCartTotal()

  const router = useRouter();


  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-lg flex flex-col gap-2">
      <div>
        <h3 className="font-heading text-lg text-neutral-dark">Order Summary</h3>
      </div>

      <div className="flex justify-between text-sm text-neutral-700">
        <span>Subtotal</span>
        <span className='flex gap-2'><span className='line-through'>₹{compareTotal}</span>₹{subtotal?.toFixed(2)}</span>
      </div>
      <div className="flex justify-between text-sm text-neutral-700">
        <span>Shipping</span>
        <span className={`${(shipping || finalPayable < 999) ? 'text-accent1' : 'text-green-600'}`}>{shipping ? shipping : finalPayable > 999 ? 'Free': 'Enter Pincode'}</span>
      </div>
      {giftWrapTotal > 0 && (
        <div className="flex justify-between text-sm text-neutral-700">
          <span>Gift Wrap</span>
          <span>+ ₹{giftWrapTotal?.toFixed(2)}</span>
        </div>
      )}

      <Separator />

      <div className="flex justify-between font-semibold text-base text-neutral-dark">
        <span>Total</span>
        <span>₹{total?.toFixed(2)}</span>
      </div>

      <p className="text-xs text-pink-500 mt-1">
        🎁 Orders above ₹599 get **free surprise mini gift**! Don’t miss out.
      </p>

      <p className="text-xs text-blue-500">
        🚚 Orders placed before <strong>7PM</strong> will be shipped **today**.
      </p>
      <SheetClose asChild>
        <Button className="w-full font-cta text-sm rounded-xl mt-4 hover:bg-accent1 text-white" onClick={() => router.push('/checkout')}>
          {useCheckoutCTA()}
        </Button>
      </SheetClose>
    </div>
  );
}
