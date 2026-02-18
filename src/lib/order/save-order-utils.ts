import type { CartItem } from "@/store/cart/cart-store";

export type PaymentMethod = "upi" | "card" | "cod";

export type SaveOrderPayload = {
  paymentResponse?: {
    razorpay_order_id?: string;
    razorpay_payment_id?: string;
  };
  cartItems?: CartItem[];
  totalAmount?: number;
  subtotal?: number;
  prepaidAmount?: number;
  codAmount?: number;
  checkoutInfo?: {
    fullName?: string;
    email?: string;
    phoneNumber?: string;
    address?: string;
    city?: string;
    pincode?: string;
  };
  paymentMethod?: PaymentMethod;
  payableOnDelivery?: number;
};

export function createFallbackOrderId(now = Date.now()) {
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `TNV_${now}_${rand}`;
}

export function isValidPaymentMethod(v: unknown): v is PaymentMethod {
  return v === "upi" || v === "card" || v === "cod";
}

export function validateSaveOrderPayload(payload: SaveOrderPayload): string | null {
  if (!isValidPaymentMethod(payload.paymentMethod)) {
    return "Invalid payment method";
  }

  if (!Array.isArray(payload.cartItems) || payload.cartItems.length === 0) {
    return "Cart items are required";
  }

  if (typeof payload.totalAmount !== "number" || payload.totalAmount <= 0) {
    return "Invalid total amount";
  }

  const info = payload.checkoutInfo;
  if (!info?.fullName || !info?.phoneNumber || !info?.address || !info?.city || !info?.pincode) {
    return "Incomplete checkout info";
  }

  return null;
}

export function getCanonicalOrderFields(payload: SaveOrderPayload) {
  const orderId = payload.paymentResponse?.razorpay_order_id || createFallbackOrderId();
  const paymentId = payload.paymentResponse?.razorpay_payment_id || null;
  const isCOD = payload.paymentMethod === "cod";
  const paymentStatus: "paid" | "cod" = isCOD ? "cod" : "paid";

  return {
    orderId,
    paymentId,
    isCOD,
    paymentStatus,
  };
}
