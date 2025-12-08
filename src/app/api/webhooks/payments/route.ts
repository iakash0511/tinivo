// app/api/webhooks/payment/route.ts
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { sendOrderEmail } from '@/lib/notifications/email'
import { sendOrderWhatsapp } from '@/lib/notifications/whatsapp'

const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET!

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text()
    const signature = req.headers.get('x-razorpay-signature') || ''

    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(rawBody)
      .digest('hex')

    if (expectedSignature !== signature) {
      console.error('Invalid webhook signature')
      return NextResponse.json({ success: false }, { status: 400 })
    }

    const payload = JSON.parse(rawBody)

    // You’ll adapt this based on your gateway event structure
    const event = payload.event as string

    // Only act on successful payments/orders
    if (
      event !== 'payment.captured' &&
      event !== 'order.paid' &&
      event !== 'charge.succeeded'
    ) {
      return NextResponse.json({ success: true })
    }

    // 🔍 Example: construct a normalized "order" object
    // You MUST adapt this mapping to your actual payload:
    const paymentEntity = payload.payload?.payment?.entity || payload.payload?.order?.entity

    const order = {
      id: paymentEntity?.id || payload.id,
      amount: (paymentEntity?.amount || 0) / 100, // paise to ₹
      currency: paymentEntity?.currency || 'INR',
      customerName:
        paymentEntity?.notes?.customer_name ||
        paymentEntity?.customer_name ||
        'Unknown',
      customerPhone:
        paymentEntity?.contact ||
        paymentEntity?.notes?.customer_phone ||
        '',
      customerEmail:
        paymentEntity?.email ||
        paymentEntity?.notes?.customer_email ||
        '',
      // If you store cart info / line items in notes or metadata
      items: paymentEntity?.notes?.items
        ? JSON.parse(paymentEntity.notes.items)
        : [], // [{ name, qty, price }]
      paymentMethod: paymentEntity?.method || 'unknown',
      status: paymentEntity?.status || 'captured',
      createdAt: new Date(),
    }

    // TODO: Save this order object in your DB / Sanity here if you want

    // 🔔 Send notifications (fire & forget, but still await for simplicity)
    await Promise.all([
      sendOrderEmail(order),
      sendOrderWhatsapp(order),
    ])

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Webhook error', err)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
