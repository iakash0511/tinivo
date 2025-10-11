'use client'
import { useCartTotal } from "@/hooks/useCartTotal"
import { useCart } from "@/store/cart/cart-store";

export default function CheckoutSummary() {

    // Get cart totals
    const { subtotal, giftWrapTotal, total, saved, shipping } = useCartTotal()
    const items = useCart((state) => state.items);    

    return (
        <aside className="bg-white rounded-2xl shadow-md p-6 h-fit sticky top-6">
          {/* Cart items here */}
          <div className="max-h-72 overflow-y-auto mb-4">
            {items.map((item) => (
                <div key={item._id} className="flex justify-between mb-2">
                    <span className="text-neutral-600">{item.name} x {item.quantity}</span>
                    <span className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
            ))}
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-neutral-600">Subtotal</span>
            <span className="font-medium">₹{subtotal}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-neutral-600">Gift Wrap</span>
            <span className="font-medium text-accent1">₹{giftWrapTotal}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-neutral-600">Shipping</span>
            <span className={`font-medium ${shipping ? 'text-accent1' : 'text-green-600'}`}>{shipping ? shipping : 'Free'}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-neutral-600">You Saved</span>
            <span className="font-medium text-green-600">₹{saved}</span>
          </div>
          <hr className="my-3" />
          <div className="flex justify-between text-lg font-heading">
            <span>Total</span>
            <span>₹{total}</span>
          </div>
        </aside>
    )
}