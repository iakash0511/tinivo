import { CartItem } from "@/store/cart/cart-store";
import { createClient } from "@sanity/client"
import { NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"
import crypto from "crypto";
import { calculateOrderAmount } from "@/lib/order-utils";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: "production",
  token: process.env.SANITY_WRITE_TOKEN!,
  apiVersion: "2024-01-01",
  useCdn: false,
})

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    let userId = null;
    
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      const payload = verifyToken(token);
      if (payload?.userId) {
        userId = payload.userId;
      }
    }

    const body = await req.json();
    const {
      paymentResponse,
      cartItems,
      checkoutInfo,
      paymentMethod,
      promoCode,
      shippingRate
    } = body;
  
    // 1. Verify Razorpay Signature
    // Even for COD, we charge a ₹150 confirmation fee via Razorpay.
    if (paymentResponse.razorpay_signature) {
       const secret = process.env.RAZORPAY_SECRET_KEY || process.env.RAZORPAY_KEY_SECRET;
       if (!secret) {
         console.error("RAZORPAY_SECRET_KEY missing for verification");
         throw new Error("Payment verification failed: secret not configured");
       }

       const hmac = crypto.createHmac("sha256", secret);
       hmac.update(`${paymentResponse.razorpay_order_id}|${paymentResponse.razorpay_payment_id}`);
       const generatedSignature = hmac.digest("hex");

       if (generatedSignature !== paymentResponse.razorpay_signature) {
         console.error("Signature mismatch!");
         return NextResponse.json({ success: false, error: "Invalid payment signature" }, { status: 400 });
       }
    } else {
       // If no signature is provided, we only allow this if it's strictly a 100% COD order (not applicable here as we require ₹150)
       return NextResponse.json({ success: false, error: "Payment signature missing" }, { status: 400 });
    }

    // 2. Re-calculate and verify the order amount on server to prevent manipulation
    const { finalPayable, subtotal } = await calculateOrderAmount(
      cartItems.map((i: any) => ({ _id: i._id, quantity: i.quantity, giftWrap: i.giftWrap })),
      paymentMethod,
      promoCode,
      shippingRate
    );

    const isPartialCOD = paymentMethod === "cod";
    const COD_PREPAID_AMOUNT = 150;

    // 3. Atomically Decrement Inventory & Create Order using Sanity Transaction
    const transaction = client.transaction();

    // Decrement quantities
    cartItems.forEach((item: any) => {
      transaction.patch(item._id, p => p.dec({ quantity: item.quantity }));
    });

    let paymentStatus: "paid" | "cod" = isPartialCOD ? "paid" : "paid"; // Payment for online or COD deposit is 'paid'
    // Actually, order document has paymentStatus: paid | failed | pending
    // Let's stick to the schema types: paid, failed, pending

    transaction.create({
      _type: "order",
      ...(userId && { userId }),
      orderId: paymentResponse.razorpay_order_id,
      paymentId: paymentResponse.razorpay_payment_id,
      paymentMethod,
      paymentStatus: "paid", // The Razorpay portion is paid
      prepaidAmount: isPartialCOD ? COD_PREPAID_AMOUNT : finalPayable,
      codAmount: isPartialCOD ? Math.max(0, finalPayable - COD_PREPAID_AMOUNT) : 0,
      codNonRefundableAfterDispatch: isPartialCOD,
      shippingStatus: "pending",
      customerName: checkoutInfo.fullName,
      email: checkoutInfo.email,
      phone: checkoutInfo.phoneNumber,
      address: checkoutInfo.address,
      city: checkoutInfo.city,
      pincode: checkoutInfo.pincode,
      total: finalPayable,
      payableOnDelivery: isPartialCOD ? Math.max(0, finalPayable - COD_PREPAID_AMOUNT) : 0,
      subtotal,
      items: cartItems.map((item: CartItem) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
    });

    await transaction.commit();

    return NextResponse.json({ 
      success: true, 
      order: {
        orderId: paymentResponse.razorpay_order_id,
        total: finalPayable,
        customerName: checkoutInfo.fullName,
        email: checkoutInfo.email
      } 
    })
  } catch (error: any) {
    console.error("Save Order Error:", error)
    return NextResponse.json({ success: false, error: error.message || "Internal Server Error" }, { status: 500 })
  }
}
