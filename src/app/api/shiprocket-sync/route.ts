import { NextResponse } from "next/server"
import { createClient } from "@sanity/client"
import { Resend } from "resend"

const SHIPROCKET_BASE_URL = process.env.SHIPROCKET_BASE_URL || "https://apiv2.shiprocket.in/v1/external"

export const runtime = "nodejs"

const resend = new Resend(process.env.RESEND_API_KEY!)

const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: "production",
  token: process.env.SANITY_WRITE_TOKEN!,
  apiVersion: "2024-01-01",
  useCdn: false,
})

async function getShiprocketToken() {
  const res = await fetch(`${SHIPROCKET_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: process.env.SHIPROCKET_EMAIL,
      password: process.env.SHIPROCKET_PASSWORD,
    }),
  })
  const data = await res.json()
  return data.token
}

export async function GET() {
  try {
    console.log("🚚 Shiprocket Sync Started")

    const token = await getShiprocketToken()
    if (!token) throw new Error("Failed to get Shiprocket token")

    // 1️⃣ Fetch all paid orders with trackingId from Sanity
    const orders = await sanity.fetch(
      `*[_type == "order" && defined(trackingId)]{_id, orderId, trackingId, shippingStatus, email, customerName}`
    )

    if (!orders.length)
      return NextResponse.json({ message: "No active shipments found" })

    for (const order of orders) {
      // 2️⃣ Fetch latest shipment status from Shiprocket
      const res = await fetch(
        `${SHIPROCKET_BASE_URL}/courier/track/shipment/${order.trackingId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      const data = await res.json()
      const status = data?.tracking_data?.shipment_status || "unknown"

      // 3️⃣ Only update if status has changed
      if (status && status !== order.shippingStatus) {
        console.log(`📦 Updating ${order.orderId} → ${status}`)
        await sanity
          .patch(order._id)
          .set({ shippingStatus: status })
          .commit()

        // 4️⃣ Notify customer via email
        await resend.emails.send({
          from: "Tinivo <orders@tinivo.store>",
          to: order.email,
          subject: `Your Tinivo order is now ${status}`,
          html: `
            <p>Hi ${order.customerName},</p>
            <p>Your order <b>${order.orderId}</b> status has been updated to:</p>
            <h3 style="color:#9D7EDB">${status.toUpperCase()}</h3>
            <p>Thank you for choosing <b>Tinivo</b> 💜</p>
            <br/>
            <a href="https://tinivo.vercel.app/orders" style="background:#9D7EDB;padding:10px 20px;color:white;border-radius:8px;text-decoration:none;">Track Order</a>
          `,
        })
      }
    }

    return NextResponse.json({ success: true, updated: orders.length })
  } catch (error) {
    console.error("❌ Shiprocket Sync Error:", error)
    return NextResponse.json({ success: false, error }, { status: 500 })
  }
}
