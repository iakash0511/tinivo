import crypto from "crypto"
import { NextResponse } from "next/server"
import { createClient } from "@sanity/client"
export const config = {
  api: {
    bodyParser: false,
  },
}

const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: "production",
  token: process.env.SANITY_WRITE_TOKEN!,
  apiVersion: "2024-01-01",
  useCdn: false,
})

export async function POST(req: Request) {
  try {
    const body = await req.text()
    const signature = req.headers.get("x-razorpay-signature")!

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
      .update(body)
      .digest("hex")

    if (expectedSignature !== signature) {
      console.error("⚠️ Webhook signature mismatch")
      return NextResponse.json({ success: false }, { status: 400 })
    }

    const event = JSON.parse(body)

    if (event.event === "payment.captured" || event.event === "order.paid") {
      const payment = event.payload.payment?.entity
      const orderId = payment?.order_id
      const paymentId = payment?.id

      console.log("✅ Payment captured:", paymentId)

      // Update order in Sanity
      await sanity
        .patch(orderId)
        .set({ paymentStatus: "paid", paymentId })
        .commit()
        .catch(async () => {
          // If not found, create it
          await sanity.create({
            _type: "order",
            orderId,
            paymentId,
            paymentStatus: "paid",
            shippingStatus: "pending",
          })
        })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ success: false, error }, { status: 500 })
  }
}
