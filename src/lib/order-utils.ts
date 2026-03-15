import { client } from "./sanity.client";

export interface ServerCartItem {
  _id: string;
  quantity: number;
  giftWrap?: boolean;
}

export async function calculateOrderAmount(
  items: ServerCartItem[],
  paymentMethod: string,
  promoCode?: string,
  shippingRate: number = 0
) {
  // 1. Fetch live product data from Sanity
  const productIds = items.map(item => item._id);
  const products = await client.fetch(
    `*[_type == "product" && _id in $productIds]{
        _id,
        price,
        quantity
    }`,
    { productIds }
  );

  let subtotal = 0;
  let giftWrapTotal = 0;
  const GIFT_WRAP_FEE = 49;

  // 2. Calculate Subtotal and Gift Wrap
  for (const item of items) {
    const product = products.find((p: { _id: string; price: number; quantity: number }) => p._id === item._id);
    if (!product) {
      throw new Error(`Product with ID ${item._id} not found.`);
    }
    
    // Check stock availability
    if (product.quantity < item.quantity) {
      throw new Error(`Only ${product.quantity} items of ${item._id} are available in stock.`);
    }

    subtotal += product.price * item.quantity;
    if (item.giftWrap) {
      giftWrapTotal += GIFT_WRAP_FEE;
    }
  }

  // 3. Online payment discount (2%)
  const isOnline = ["upi", "card", "online"].includes(paymentMethod);
  const discountRate = isOnline ? 0.02 : 0;
  const paymentDiscount = Number((subtotal * discountRate).toFixed(2));

  // 4. Promo Code Discount
  let promoDiscount = 0;
  if (promoCode) {
    const discountDoc = await client.fetch(
      `*[_type == "discountCode" && code == $code && active == true][0]`,
      { code: promoCode.toUpperCase() }
    );

    if (discountDoc) {
      // Validate expiry
      const isExpired = discountDoc.expiryDate && new Date(discountDoc.expiryDate) < new Date();
      if (!isExpired) {
        if (discountDoc.discountType === 'percent') {
          promoDiscount = (subtotal * discountDoc.value) / 100;
        } else if (discountDoc.discountType === 'flat') {
          promoDiscount = discountDoc.value;
        }
      }
    }
  }

  // 5. Final Shipping calculation
  // Free shipping above ₹999
  const totalForShippingCheck = subtotal + giftWrapTotal;
  const finalShipping = totalForShippingCheck > 999 ? 0 : shippingRate;

  const totalDeduction = paymentDiscount + promoDiscount;
  const finalPayable = Math.max(0, subtotal + giftWrapTotal + finalShipping - totalDeduction);

  return {
    subtotal,
    giftWrapTotal,
    shipping: finalShipping,
    paymentDiscount,
    promoDiscount,
    finalPayable: Number(finalPayable.toFixed(2)),
  };
}
