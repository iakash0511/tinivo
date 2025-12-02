// app/api/razorpay/route.ts
import Razorpay from "razorpay";
import { NextResponse } from "next/server";

export const runtime = "nodejs"; // ensure Node runtime (not edge)

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // Expect amount to be in paise (integer)
    const amount = typeof body.amount === "number" ? Math.round(body.amount) : NaN;

    if (!amount || isNaN(amount) || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount (expect paise integer)" }, { status: 400 });
    }

    const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_SECRET_KEY || process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      console.error("Razorpay keys missing in env");
      return NextResponse.json({ error: "Razorpay not configured" }, { status: 500 });
    }

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const options = {
      amount: amount, // already in paise
      currency: "INR",
      receipt: `TNV_${Date.now()}`,
      payment_capture: 1,
    };

    const order = await razorpay.orders.create(options);
    return NextResponse.json(order);
  } catch (error: unknown) {
    const errObj = (typeof error === 'object' && error !== null) ? error as Record<string, unknown> : undefined;
    const statusCode = errObj && typeof errObj['statusCode'] === 'number' ? errObj['statusCode'] : undefined;
    const details = (errObj && ('error' in errObj ? errObj['error'] : undefined)) ?? error;
    console.error("Razorpay Error:", statusCode ?? "", details ?? error);
    const message = errObj && typeof errObj['message'] === 'string' ? errObj['message'] : String(error);
    return NextResponse.json({ error: "Failed to create order", details: message }, { status: 500 });
  }
}
