import type { CartItem } from "@/store/cart/cart-store";
import { createClient } from "@sanity/client"
import { NextResponse } from "next/server"
import { getCanonicalOrderFields, type SaveOrderPayload, validateSaveOrderPayload } from "@/lib/order/save-order-utils"

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: "production",
  token: process.env.SANITY_WRITE_TOKEN!,
  apiVersion: "2024-01-01",
  useCdn: false,
})

export async function POST(req: Request) {
  try {
    const payload = (await req.json()) as SaveOrderPayload

    const validationError = validateSaveOrderPayload(payload)
    if (validationError) {
      return NextResponse.json({ success: false, error: validationError }, { status: 400 })
    }

    const {
      cartItems,
      totalAmount,
      subtotal,
      prepaidAmount,
      codAmount,
      checkoutInfo,
      paymentMethod,
      payableOnDelivery,
    } = payload

    const { paymentStatus, isCOD, orderId: canonicalOrderId, paymentId } = getCanonicalOrderFields(payload)

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
      customerName: checkoutInfo!.fullName,
      email: checkoutInfo!.email ?? "",
      phone: checkoutInfo!.phoneNumber,
      address: checkoutInfo!.address,
      city: checkoutInfo!.city,
      pincode: checkoutInfo!.pincode,
      total: totalAmount,
      payableOnDelivery: isCOD ? (payableOnDelivery ?? 0) : 0,
      subtotal: subtotal ?? totalAmount,
      items: cartItems!.map((item: CartItem) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
    })

    return NextResponse.json({ success: true, order: newOrder, orderId: canonicalOrderId })
  } catch (error) {
    console.error("Save Order Error:", error)
    return NextResponse.json({ success: false, error }, { status: 500 })
  }
}
