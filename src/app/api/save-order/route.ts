import { CartItem } from "@/store/cart/cart-store";
import { createClient } from "@sanity/client"
import { NextResponse } from "next/server"

type PaymentMethod = "upi" | "card" | "cod";

type SaveOrderPayload = {
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

function createFallbackOrderId() {
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `TNV_${Date.now()}_${rand}`;
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: "production",
  token: process.env.SANITY_WRITE_TOKEN!,
  apiVersion: "2024-01-01",
  useCdn: false,
})

export async function POST(req: Request) {
  try {
    const {
      paymentResponse,
      cartItems,
      totalAmount,
      subtotal,
      prepaidAmount,
      codAmount,
      checkoutInfo,
      paymentMethod,
      payableOnDelivery
    } = (await req.json()) as SaveOrderPayload

    if (!paymentMethod || !["upi", "card", "cod"].includes(paymentMethod)) {
      return NextResponse.json({ success: false, error: "Invalid payment method" }, { status: 400 })
    }

    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return NextResponse.json({ success: false, error: "Cart items are required" }, { status: 400 })
    }

    if (typeof totalAmount !== "number" || totalAmount <= 0) {
      return NextResponse.json({ success: false, error: "Invalid total amount" }, { status: 400 })
    }

    if (!checkoutInfo?.fullName || !checkoutInfo?.phoneNumber || !checkoutInfo?.address || !checkoutInfo?.city || !checkoutInfo?.pincode) {
      return NextResponse.json({ success: false, error: "Incomplete checkout info" }, { status: 400 })
    }

    const paymentStatus: "paid" | "cod" = paymentMethod === "cod" ? "cod" : "paid";
    const isCOD = paymentMethod === "cod"
    const canonicalOrderId = paymentResponse?.razorpay_order_id || createFallbackOrderId()
    const paymentId = paymentResponse?.razorpay_payment_id || null




    // Create order in Sanity
    const newOrder = await client.create({
      _type: "order",
      orderId: canonicalOrderId,
      paymentId,
      paymentMethod,
      paymentStatus,
      prepaidAmount: prepaidAmount ?? totalAmount,
      codAmount: codAmount ?? 0,
      codNonRefundableAfterDispatch: isCOD,
      shippingStatus: "pending",
      customerName: checkoutInfo.fullName,
      email: checkoutInfo.email ?? "",
      phone: checkoutInfo.phoneNumber,
      address: checkoutInfo.address,
      city: checkoutInfo.city,
      pincode: checkoutInfo.pincode,
      total: totalAmount,
      payableOnDelivery: isCOD ? (payableOnDelivery ?? 0) : 0,
      subtotal: subtotal ?? totalAmount,
      items: cartItems.map((item: CartItem) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
    })

    // 🔁 Send this order to Shiprocket
    return NextResponse.json({ success: true, order: newOrder, orderId: canonicalOrderId })
  } catch (error) {
    console.error("Save Order Error:", error)
    return NextResponse.json({ success: false, error }, { status: 500 })
  }
}
