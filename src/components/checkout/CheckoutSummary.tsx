'use client'
import { useCartTotal } from "@/hooks/useCartTotal"
import { useCart } from "@/store/cart/cart-store"

export default function CheckoutSummary({ isMobile }: { isMobile?: boolean } = {}) {
  const { subtotal, giftWrapTotal, finalPayable, saved, shipping } = useCartTotal()
  const items = useCart((state) => state.items)

  const fmt = (v: number | string) =>
    `₹${Number(v || 0).toFixed(2)}`

  return (
    <aside className={`${isMobile ? '' : 'bg-white rounded-2xl shadow-md p-6 h-fit sticky top-6'}`}>
      <h3 className="text-lg font-heading mb-4">Order Summary</h3>

      <div className="max-h-72 overflow-y-auto mb-4 space-y-3">
        {items.map((item) => (
          <div key={item._id} className="flex justify-between items-start gap-3">
            <div className="flex-1">
              <div className="text-neutral-600 text-sm">{item.name}</div>
              <div className="text-xs text-neutral-500">x {item.quantity}</div>
            </div>
            <div className="font-medium">{fmt(item.price * item.quantity)}</div>
          </div>
        ))}
      </div>

      <div className="space-y-2 text-sm text-neutral-600">

        <div className="flex justify-between">
          <span>Subtotal</span>
          <span className="font-medium">{fmt(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span>Gift Wrap</span>
          <span className="font-medium text-accent1">{fmt(giftWrapTotal)}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span className={`font-medium ${(shipping || finalPayable < 599) ? 'text-accent1' : 'text-green-600'}`}>{shipping ? fmt(shipping) : finalPayable > 599 ? 'Free': 'Enter Pincode'}</span>
        </div>
        <div className="flex justify-between">
          <span>You Saved</span>
          <span className="font-medium text-green-600">{fmt(saved)}</span>
        </div>
      </div>

      <hr className="my-3" />

      <div className="flex justify-between items-center text-lg font-heading">
        <span>Total</span>
        <span className="text-xl font-bold">{fmt(finalPayable)}</span>
      </div>

      <div className="mt-3 text-xs text-neutral-500">
        Taxes included where applicable. By placing your order you agree to our <a className="underline" href="/terms-and-conditions">terms</a>.
      </div>
    </aside>
  )
}
