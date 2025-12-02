import Razorpay from "razorpay"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { amount } = await req.json()

    const razorpay = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_SECRET_KEY!,
    })

    const options = {
      amount: Math.round(amount * 100), // in paise
      currency: "INR",
      receipt: `TNV_${Date.now()}`,
    }

    const order = await razorpay.orders.create(options)
    return NextResponse.json(order)
  } catch (error) {
    console.error("Razorpay Error:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}
