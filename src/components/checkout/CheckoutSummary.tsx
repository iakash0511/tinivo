'use client'
import { useState } from "react"
import { useCartTotal } from "@/hooks/useCartTotal"
import { useCart } from "@/store/cart/cart-store"
import { useCheckoutStore } from "@/store/checkout/checkout-store"
import { toast } from "react-hot-toast"

export default function CheckoutSummary({ isMobile }: { isMobile?: boolean } = {}) {
  const { subtotal, giftWrapTotal, finalPayable, saved, shipping, discountAmount } = useCartTotal();
  const { items, buyNowItem } = useCart();
  const currentItems = buyNowItem ? [buyNowItem] : items;
  const { appliedDiscount, setAppliedDiscount } = useCheckoutStore()

  const [promoCode, setPromoCode] = useState("")
  const [applying, setApplying] = useState(false)

  const handleApplyPromo = async () => {
    if (!promoCode) return;
    setApplying(true);
    try {
      const token = localStorage.getItem("token") || "";
      const res = await fetch("/api/discount/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ code: promoCode, cartValue: subtotal })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setAppliedDiscount({ code: data.code, amount: data.discountAmount });
      setPromoCode("");
      toast.success(data.message || "Promo code applied!");
    } catch (error: any) {
      toast.error(error.message || "Invalid promo code");
    } finally {
      setApplying(false);
    }
  }

  const handleRemovePromo = () => {
    setAppliedDiscount(null);
  }

  const fmt = (v: number | string) =>
    `₹${Number(v || 0).toFixed(2)}`

  return (
    <aside className={`${isMobile ? '' : 'bg-white rounded-2xl shadow-md p-6 h-fit sticky top-6'}`}>
      <h3 className="text-lg font-heading mb-4">Order Summary</h3>

      <div className="max-h-72 overflow-y-auto mb-4 space-y-3">
        {currentItems.map((item) => (
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
          <span className={`font-medium ${(shipping || finalPayable < 999) ? 'text-accent1' : 'text-green-600'}`}>{shipping ? fmt(shipping) : finalPayable > 999 ? 'Free' : 'Choose Shipping'}</span>
        </div>
        <div className="flex justify-between">
          <span>You Saved</span>
          <span className="font-medium text-green-600">{fmt(saved + discountAmount)}</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-dashed">
        {!appliedDiscount ? (
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Promo Code"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              className="flex-1 rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <button
              onClick={handleApplyPromo}
              disabled={applying || !promoCode}
              className="rounded-md bg-neutral-800 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700 disabled:opacity-50"
            >
              {applying ? "..." : "Apply"}
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between rounded-md bg-green-50 px-3 py-2 text-sm text-green-800 border border-green-200">
            <div>
              <span className="font-bold">{appliedDiscount.code}</span>
              <span className="ml-2 text-green-600">- {fmt(appliedDiscount.amount)}</span>
            </div>
            <button
              onClick={handleRemovePromo}
              className="text-green-600 hover:text-green-900 focus:outline-none"
            >
              ✕
            </button>
          </div>
        )}
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
