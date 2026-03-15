import Razorpay from "razorpay";
import { NextResponse } from "next/server";
import { calculateOrderAmount, ServerCartItem } from "@/lib/order-utils";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items, paymentMethod, promoCode, shippingRate, isCODPrepaid } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Empty or invalid cart items" }, { status: 400 });
    }

    // 1. Calculate the verified order amount on the server
    const { finalPayable } = await calculateOrderAmount(
      items,
      paymentMethod,
      promoCode,
      shippingRate
    );

    // 2. Determine the actual amount to charge in Razorpay
    // If it's a COD partial payment confirmation, the amount is fixed at ₹150
    // Otherwise, charge the full final payable amount.
    const amountToCharge = isCODPrepaid ? 150 : finalPayable;
    const amountInPaise = Math.round(amountToCharge * 100);

    if (amountInPaise <= 0) {
      return NextResponse.json({ error: "Invalid payment amount calculated" }, { status: 400 });
    }

    const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_SECRET_KEY || process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      console.error("Razorpay keys missing in environment variables");
      return NextResponse.json({ error: "Razorpay integration not configured" }, { status: 500 });
    }

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: `TNV_${Date.now()}`,
      payment_capture: 1,
    };

    const order = await razorpay.orders.create(options);
    return NextResponse.json(order);
  } catch (error: any) {
    console.error("Razorpay Order Error:", error);
    return NextResponse.json({ error: "Failed to create payment order", details: error.message }, { status: 500 });
  }
}
