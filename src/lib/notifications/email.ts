// lib/notifications/email.ts
import "server-only";
import { Resend } from "resend";

const toEmail = process.env.SALES_ALERT_EMAIL;

type OrderItem = {
  name: string;
  quantity: number;
  price: number;
};

export type OrderForEmail = {
  _id: string;
  total: number;
  customerName: string;
  phone?: string;
  email?: string;
  items?: OrderItem[];
  paymentStatus?: string;
  status?: string;
  _createdAt?: Date;
};

let resendClient: Resend | null = null;

function getResend() {
  if (!resendClient) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error("❌ RESEND_API_KEY is missing in env");
      throw new Error("RESEND_API_KEY not set");
    }
    resendClient = new Resend(apiKey);
  }
  return resendClient;
}

export async function sendOrderEmail(order: OrderForEmail) {
  if (!toEmail) {
    console.warn("SALES_ALERT_EMAIL not set, skipping email notification");
    return;
  }

  const resend = getResend();

  const subject = `🧾 New Tinivo Order – ₹${order.total} from ${order.customerName}`;

  const itemsText =
    order.items && order.items.length
      ? order.items
          .map(
            (item) =>
              `• ${item.name} x${item.quantity} – ₹${item.price * item.quantity}`,
          )
          .join("\n")
      : "Items not available";

  const plainText = `
New Tinivo order 🎀

Order ID: ${order._id}
Amount: ₹${order.total}
Status: ${order.status}
Payment: ${order.paymentStatus}

Customer:
- Name: ${order.customerName}
- Phone: ${order.phone || "N/A"}
- Email: ${order.email || "N/A"}

Items:
${itemsText}

Time: ${
    order._createdAt?.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
    }) || "N/A"
  }

– Tinivo Bot
`.trim();

  const html = `
  <div style="font-family: system-ui, -apple-system, BlinkMacSystemFont;">
    <h2>🎀 New Tinivo Order</h2>
    <p><strong>Order ID:</strong> ${order._id}</p>
    <p><strong>Amount:</strong> ₹${order.total}</p>
    <p><strong>Payment:</strong> ${order.paymentStatus}</p>
    <hr />
    <h3>Customer</h3>
    <p><strong>Name:</strong> ${order.customerName}</p>
    <p><strong>Phone:</strong> ${order.phone || "N/A"}</p>
    <p><strong>Email:</strong> ${order.email || "N/A"}</p>
    <hr />
    <h3>Items</h3>
    <ul>
      ${
        order.items && order.items.length
          ? order.items
              .map(
                (item) =>
                  `<li>${item.name} ×${item.quantity} – ₹${
                    item.price * item.quantity
                  }</li>`,
              )
              .join("")
          : "<li>Items not available</li>"
      }
    </ul>
    <p style="margin-top: 16px; font-size: 12px; color: #666;">
      Time: ${
        order._createdAt?.toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
        }) || "N/A"
      }
    </p>
  </div>
  `.trim();

  await resend.emails.send({
    from: "Tinivo <orders@tinivo.store>",
    to: toEmail,
    subject,
    text: plainText,
    html,
  });
}
