import { CartItem } from "@/store/cart/cart-store";
import { createClient } from "@sanity/client"
import { NextResponse } from "next/server"

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
} = await req.json()
  
let paymentStatus: "paid" | "cod";

if (paymentMethod === "cod") {
  paymentStatus = "cod";
} else {
  paymentStatus = "paid";
}
const isPartialCOD = paymentMethod === "cod"




    // Create order in Sanity
    const newOrder = await client.create({
      _type: "order",
      orderId: paymentResponse.razorpay_order_id,
      paymentId: paymentResponse.razorpay_payment_id,
      paymentMethod,
      paymentStatus,
      prepaidAmount: prepaidAmount ?? totalAmount,
      codAmount: codAmount ?? 0,
      codNonRefundableAfterDispatch: paymentMethod === "partial_cod",
      shippingStatus: "pending",
      customerName: checkoutInfo.fullName,
      email: checkoutInfo.email,
      phone: checkoutInfo.phoneNumber,
      address: checkoutInfo.address,
      city: checkoutInfo.city,
      pincode: checkoutInfo.pincode,
      total: totalAmount,
      payableOnDelivery: isPartialCOD ? payableOnDelivery : 0,
      subtotal,
      items: cartItems.map((item: CartItem) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
    })

    // 🔁 Send this order to Shiprocket
    return NextResponse.json({ success: true, order: newOrder })
  } catch (error) {
    console.error("Save Order Error:", error)
    return NextResponse.json({ success: false, error }, { status: 500 })
  }
}
