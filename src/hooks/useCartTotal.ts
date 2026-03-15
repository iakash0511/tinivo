// hooks/useCartTotal.ts (updated shipping logic)
import { useCart } from "@/store/cart/cart-store";
import { useCheckoutStore } from "@/store/checkout/checkout-store";
import { useMemo } from "react";

interface CartTotal {
  subtotal: number;
  giftWrapTotal: number;
  total: number;
  saved: number;
  shipping: number;
  compareTotal: number;
  finalPayable: number;
  discountAmount: number; // For rendering applied discount details
}

export function useCartTotal(): CartTotal {
  const { paymentMethod, appliedDiscount } = useCheckoutStore();
  const shippingOption = useCheckoutStore((s) => s.shippingOption);

  const { items, buyNowItem } = useCart();
  const currentItems = buyNowItem ? [buyNowItem] : items;

  const giftWrapFee = 49;

  const compareTotal = currentItems.reduce(
    (sum, item) =>
      sum + (item.compareAtPrice ? item.compareAtPrice : 0) * item.quantity,
    0
  );

  const subtotal = currentItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const giftWrapTotal = currentItems.reduce(
    (sum, item) => sum + (item.giftWrap ? giftWrapFee : 0),
    0
  );

  let total = subtotal + giftWrapTotal;

  const isOnline = paymentMethod === "upi" || paymentMethod === "card";

  // Now read shipping from store if present, otherwise fallback to old rule
  const shipping = total > 999 ? 0 : typeof shippingOption?.rate === 'number' ? shippingOption.rate : 0;

  const discountRate = isOnline ? 0.02 : 0;
  const saved = compareTotal - subtotal;
  const discountAmount = useMemo(
    () => Number((Number(subtotal || 0) * discountRate).toFixed(2)),
    [subtotal, discountRate]
  );
  const finalPayable = useMemo(() => {
    const s = Number(subtotal || 0);
    const g = Number(giftWrapTotal || 0);
    const sh = typeof shipping === "number" ? shipping : 0;
    const extraDiscount = Number(appliedDiscount?.amount || 0);

    // Total discount is standard payment discount + promo code discount
    const totalDeduction = discountAmount + extraDiscount;

    return Math.max(0, Number((s + g + sh - totalDeduction).toFixed(2)));
  }, [subtotal, giftWrapTotal, shipping, discountAmount, appliedDiscount]);

  // Plus Shipping
  total += shipping;


  return {
    subtotal,
    giftWrapTotal,
    total,
    saved,
    shipping,
    compareTotal,
    finalPayable,
    discountAmount: Number(appliedDiscount?.amount || 0),
  };
}
