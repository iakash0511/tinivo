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
    const { paymentResponse, cartItems, totalAmount, checkoutInfo } = await req.json()

    // Create order in Sanity
    const newOrder = await client.create({
      _type: "order",
      orderId: paymentResponse.razorpay_order_id,
      paymentId: paymentResponse.razorpay_payment_id,
      paymentStatus: paymentResponse.razorpay_payment_id === "COD_PAYMENT" ? "cod" : "paid",
      shippingStatus: "pending",
      customerName: checkoutInfo.fullName,
      email: checkoutInfo.email,
      phone: checkoutInfo.phoneNumber,
      address: checkoutInfo.address,
      city: checkoutInfo.city,
      pincode: checkoutInfo.pincode,
      total: totalAmount,
      items: cartItems.map((item: {name: string, quantity: number, price: number}) => ({
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
