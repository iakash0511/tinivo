import { NextResponse } from "next/server"
import { createClient } from "@sanity/client"

const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: "production",
  token: process.env.SANITY_WRITE_TOKEN!,
  apiVersion: "2024-01-01",
  useCdn: false,
})

async function getShiprocketToken() {
  console.log("🔑 Fetching Shiprocket Token...");
  const res = await fetch(`${process.env.SHIPROCKET_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: process.env.SHIPROCKET_EMAIL,
      password: process.env.SHIPROCKET_PASSWORD,
    }),
  })
  console.log("🚀 Shiprocket API hit!");

  const data = await res.json()
  return data.token
}

export async function POST(req: Request) {
  try {
    const { order } = await req.json()
    const token = await getShiprocketToken()
    console.log("🔑 Shiprocket Token obtained", token);
    const shiprocketOrder = {
      order_id: order.orderId,
      order_date: new Date().toISOString(),
      pickup_location: "Primary", // must exist in your Shiprocket dashboard
      billing_customer_name: order.customerName,
      billing_last_name: "",
      billing_address: order.address,
      billing_city: order.city,
      billing_pincode: order.pincode,
      billing_state: "Tamil Nadu",
      billing_country: "India",
      billing_email: order.email,
      billing_phone: order.phone,
      order_items: order.items.map((item: {name: string, quantity: number, price: number}) => ({
        name: item.name,
        sku: item.name.toLowerCase().replace(/\s+/g, "-"),
        units: item.quantity,
        selling_price: item.price,
      })),
      payment_method: order.paymentStatus === "paid" ? "Prepaid" : "COD",
      sub_total: order.total,
      length: 10,
      breadth: 10,
      height: 5,
      weight: 0.5,
    }

    const res = await fetch(`${process.env.SHIPROCKET_BASE_URL}/orders/create/adhoc`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(shiprocketOrder),
    })

    const data = await res.json()

    if (!data.order_id) {
      console.error("Shiprocket Error:", data)
      return NextResponse.json({ error: "Failed to create shipment", details: data }, { status: 400 })
    }

    // Update Sanity with shipping info
    await sanity.patch(order._id).set({
      shippingStatus: "ready_to_ship",
      trackingId: data.shipment_id,
      trackingUrl: data.awb_data?.awb_assign_status
        ? `https://shiprocket.co/tracking/${data.awb_data.awb}`
        : "",
    }).commit()

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Shiprocket Error:", error)
    return NextResponse.json({ error: "Shiprocket integration failed" }, { status: 500 })
  }
}
