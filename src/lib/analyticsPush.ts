// client analytics helper
import { Product } from "@/interface/ProductInterface";
import { CartItem } from "@/store/cart/cart-store";

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
  }
}

/** TYPE OF EVENT OBJECT - Matches your existing structure exactly */
type EcommerceEvent = {
  event: string;
  ecommerce: Record<string, unknown>;
};

/**
 * Safe push function — wraps dataLayer push + optionally gtag push.
 * Does NOT modify your payload structure.
 */
function safePush(eventObj: EcommerceEvent) {
  try {
    // Ensure dataLayer exists
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(eventObj);
  } catch (err) {
    console.warn("dataLayer push failed", err);
  }

  // Optional: also send to gtag if available (does NOT change your structure)
  try {
    if (typeof window.gtag === "function") {
      const { event, ecommerce } = eventObj;
      window.gtag("event", event, ecommerce || {});
    }
  } catch (err) {
    console.warn("gtag push failed", err);
  }
}

/** -------------------------------
 *  ADD TO CART
 *  -----------------------------*/
export function pushAddToCart(product: CartItem, quantity = 1) {
  safePush({
    event: 'add_to_cart',
    ecommerce: {
      currency: product.price || 'INR', // keeping your structure EXACTLY
      value: product.price * quantity,
      items: [
        {
          item_id: product._id,
          item_name: product.name,
          price: product.price,
          quantity,
          item_category: product.category,
          item_variant: product.tags || null
        }
      ]
    }
  });
}

/** -------------------------------
 *  PURCHASE COMPLETE
 *  -----------------------------*/
export function purchaseComplete(transactionId: string, products: CartItem[], totalValue: number) {
  safePush({
    event: 'purchase',
    ecommerce: {
      transaction_id: transactionId,
      value: totalValue,
      currency: 'INR',
      items: products.map(it => ({
        item_id: it._id,
        item_name: it.name,
        price: it.price,
        quantity: it.quantity
      }))
    }
  });
}

/** -------------------------------
 *  VIEW ITEM
 *  -----------------------------*/
export function pushViewItem(product: Product) {
  safePush({
    event: "view_item",
    ecommerce: {
      items: [
        {
          item_id: product._id,
          item_name: product.name,
          price: product.price,
          item_brand: product.brand,
          item_category: product.category,
        }
      ]
    }
  });
}
