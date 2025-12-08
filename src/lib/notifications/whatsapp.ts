// lib/notifications/whatsapp.ts
import 'server-only';
import twilio from 'twilio'

const accountSid = process.env.TWILIO_ACCOUNT_SID!
const authToken = process.env.TWILIO_AUTH_TOKEN!
const fromWhatsApp = process.env.TWILIO_WHATSAPP_FROM!
const ownerWhatsApp = process.env.TINIVO_OWNER_WHATSAPP!

const client = twilio(accountSid, authToken)

type OrderItem = {
  name: string
  qty: number
  price: number
}

export type Order = {
  _id: string
  total: number
  customerName: string
  phone?: string
  email?: string
  items?: OrderItem[]
  paymentStatus?: string
  _createdAt?: Date
}

export async function sendOrderWhatsapp(order: Order) {
  if (!ownerWhatsApp) {
    console.warn('TINIVO_OWNER_WHATSAPP not set, skipping WhatsApp notification')
    return
  }

  const itemsText =
    order.items && order.items.length
      ? order.items
          .map(
            (item) =>
              `• ${item.name} x${item.qty} – ₹${item.price * item.qty}`,
          )
          .join('\n')
      : 'Items not available'

  const timeText =
    order._createdAt?.toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
    }) || 'N/A'

  const body = `
🎀 *New Tinivo Order*

*Order ID:* ${order._id}
*Customer:* ${order.customerName}
*Amount:* ₹${order.total}
*Payment:* ${order.paymentStatus}

*Items:*
${itemsText}

📱 Customer Phone: ${order.phone || 'N/A'}
📧 Customer Email: ${order.email || 'N/A'}

🕒 Time: ${timeText}
  `.trim()

  await client.messages.create({
    from: fromWhatsApp,
    to: ownerWhatsApp,
    body,
  })
}
