// app/api/order-email/route.ts
import { NextRequest, NextResponse } from "next/server";
import { sendOrderEmail, OrderForEmail } from "@/lib/notifications/email";
import { sendOrderWhatsapp } from "@/lib/notifications/whatsapp";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { order } = (await req.json()) as { order: OrderForEmail };

    if (!order || !order._id) {
      return NextResponse.json(
        { success: false, error: "Missing order data" },
        { status: 400 },
      );
    }

    
    await Promise.all([
      await sendOrderEmail({
      ...order,
      // fallback / normalize if needed
      _createdAt: order._createdAt ? new Date(order._createdAt) : new Date(),
    }),
      await sendOrderWhatsapp({
      ...order,
      // fallback / normalize if needed
      _createdAt: order._createdAt ? new Date(order._createdAt) : new Date(),
    }),
    ]);


    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Order email error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send order email" },
      { status: 500 },
    );
  }
}
