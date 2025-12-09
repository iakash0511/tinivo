// app/api/order-email/route.ts
import { NextRequest, NextResponse } from "next/server";
import { sendOrderEmail, OrderForEmail } from "@/lib/notifications/email";
import { sendOrderTelegram } from "@/lib/notifications/telegram";

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

    const normalizedOrder: OrderForEmail = {
      ...order,
      _createdAt: order._createdAt ? new Date(order._createdAt) : new Date(),
    };

    // 🔔 Email + Telegram in parallel
    await Promise.all([
      sendOrderEmail(normalizedOrder),
      sendOrderTelegram(normalizedOrder),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Order notification error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send order notifications" },
      { status: 500 },
    );
  }
}
